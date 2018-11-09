import { mod_Renderable } from "./index";
import { mod_Color } from "./../core/index";
import { CContext } from "./context";
import { CProgram, EUniform } from "./program";
import { ERenderPass } from "./renderable";
import { FUserInterfaceShaders, CUserInterfaceProgram } from "../shaders/user_interface";
import { FPostProcessShaders, CPostProcessProgram } from "../shaders/post_process";
import { FGeometryShaders, CGeometryProgram } from "../shaders/geometry";
import { FLightingShaders } from "../shaders/lighting";
import { CRenderTarget } from "./render_target";
import { CRectangle } from "../geometry/2d/rectangle";
import { CRectangleFactory } from "../geometry/2d/rectangle_factory";


export class FViewport
{
    public X: number;
    public Y: number;
    public Width: number;
    public Height: number;
    public DepthMin: number;
    public DepthMax: number;

    //////////////////////////////////////////////////////////////////////////
    // @brief Construct new viewport instance.
    // @param x [in] Top-Left corner x component (horizontal).
    // @param y [in] Top-Left corner y component (vertical).
    // @param width [in] Width of the viewport.
    // @param height [in] Height of the viewport.
    // @param depthMin [in] Minimal depth value.
    // @param depthMax [in] Maximal depth value.
    public constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        depthMin: number,
        depthMax: number )
    {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.DepthMin = depthMin;
        this.DepthMax = depthMax;
    };
};


export class CRenderer
{
    protected mContext: CContext;
    protected mFrameViewport: FViewport;
    protected mGeometryProgram: CProgram;
    protected mLightingProgram: CProgram;
    protected mUserInterfaceProgram: CProgram;
    protected mPostProcessProgram: CProgram;
    protected mUserInterfaceBlendEnable: boolean;
    protected mColorRenderTarget: CRenderTarget;
    protected mDepthRenderTarget: CRenderTarget;
    protected mFrameRenderTarget: CRenderTarget;
    protected mFrame: CRectangle;


    //////////////////////////////////////////////////////////////////////////
    // @brief Construct new renderer instance.
    // @param context [in] Instance of WebGL rendering context wrapper.
    constructor( context: CContext )
    {
        this.mContext = context;
        var gl = context.GetGLContext();

        var canvas = this.mContext.GetCanvas();
        this.mFrameViewport = new FViewport( 0, 0, canvas.width, canvas.height, 0, 1 );

        this.mGeometryProgram = new CGeometryProgram( gl, "GeometryProgram" );
        this.mUserInterfaceProgram = new CUserInterfaceProgram( gl, "UserInterfaceProgram" );
        this.mPostProcessProgram = new CPostProcessProgram( gl, "PostProcessProgram" );

        this.mLightingProgram = new CProgram(
            gl,
            "LightingProgram",
            FLightingShaders.GetVertexShaderCode(),
            FLightingShaders.GetPixelShaderCode() );
        
        this.mColorRenderTarget = new CRenderTarget(
            context, "ColorRT", canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE );

        this.mDepthRenderTarget = new CRenderTarget(
            context, "DepthRT", canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE );

        this.mFrameRenderTarget = new CRenderTarget(
            context, "FrameRT", canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE );

        this.mFrame =
            new CRectangleFactory()
                .SetWidth( 2 )
                .SetHeight( 2 )
                .SetX( -1 )
                .SetY( -1 )
                .SetName( "FRAME" )
                .SetRenderFlag( ERenderPass.Lighting )
                .SetRenderFlag( ERenderPass.PostProcessing )
                .SetRenderFlag( ERenderPass.UserInterface )
                .Create( context );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Render instance of renderable object. The renderer runs whole
    //  rendering pipeline for the object.
    // @param renderable [in] Instance of object to render.
    public Render( renderable: mod_Renderable.IRenderable ): void
    {
        var gl = this.mContext.GetGLContext();

        // Color PASS
        this.mContext.SetProgram( this.mGeometryProgram );
        this.mContext.SetViewport( this.mFrameViewport );

        this.mContext.SetRenderTargets( 1, [this.mColorRenderTarget] );
        this.Clear();

        gl.uniform2f(
            this.mGeometryProgram.GetUniformLocation( EUniform.InvFrameSize ),
            1 / this.mFrameViewport.Width,
            1 / this.mFrameViewport.Height );

        gl.uniform1i(
            this.mGeometryProgram.GetUniformLocation( EUniform.UseAlphaTexture ),
            0 );

        renderable.Render( this.mContext, ERenderPass.Geometry );

        this.OnRender_PostGeometryPass( renderable );

        //// Depth PASS
        //this.mDepthRenderTarget.BindRenderTarget( this.mContext );
        //this.Clear();
        //
        //gl.uniform1i(
        //    this.mGeometryProgram.GetUniformLocation( EUniform.RenderingPass ),
        //    0 );
        //
        //renderable.Render( this.mContext, ERenderPass.Geometry );
        
        //// Lighting
        //this.mContext.SetProgram( this.mLightingProgram );
        //this.mDepthRenderTarget.BindTexture( this.mContext, 1 );
        //
        //gl.uniform2f(
        //    this.mLightingProgram.GetUniformLocation( EUniform.InvFrameSize ),
        //    1 / this.mFrameViewport.Width,
        //    1 / this.mFrameViewport.Height );
        //gl.uniform1i(
        //    this.mLightingProgram.GetUniformLocation( EUniform.UseAlphaTexture ),
        //    0 );
        //
        //this.mFrame.Render( this.mContext, ERenderPass.Lighting );
        
        // User interface
        this.mContext.SetProgram( this.mUserInterfaceProgram );
        this.mContext.SetRenderTargets( 1, [this.mFrameRenderTarget] );
        this.Clear();

        this.mColorRenderTarget.BindTexture( this.mContext, 0 );
        this.mFrame.Render( this.mContext, ERenderPass.UserInterface );
        
        if ( this.mUserInterfaceBlendEnable )
        {
            gl.enable( gl.BLEND );
            gl.disable( gl.DEPTH_TEST );
            gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
        }
        
        gl.uniform2f(
            this.mUserInterfaceProgram.GetUniformLocation( EUniform.InvFrameSize ),
            1 / this.mFrameViewport.Width,
            1 / this.mFrameViewport.Height );
        gl.uniform1i(
            this.mUserInterfaceProgram.GetUniformLocation( EUniform.UseAlphaTexture ),
            0 );
        
        renderable.Render( this.mContext, ERenderPass.UserInterface );

        this.OnRender_PostUserInterfacePass( renderable );
        
        if ( this.mUserInterfaceBlendEnable )
        {
            gl.disable( gl.BLEND );
        }
        
        // Post process
        this.mContext.SetProgram( this.mPostProcessProgram );
        this.mContext.SetRenderTargets( 1, [null] );
        this.mFrameRenderTarget.BindTexture( this.mContext, 0 );
        
        gl.uniform2f(
            this.mPostProcessProgram.GetUniformLocation( EUniform.InvFrameSize ),
            1 / this.mFrameViewport.Width,
            1 / this.mFrameViewport.Height );
        gl.uniform1i(
            this.mPostProcessProgram.GetUniformLocation( EUniform.UseAlphaTexture ),
            0 );
        
        this.Clear();
        this.mFrame.Render( this.mContext, ERenderPass.PostProcessing );

        this.OnRender_PostPostProcessPass( renderable );
    };

    // Extensions
    protected OnRender_PostGeometryPass( renderable: mod_Renderable.IRenderable ): void { };
    protected OnRender_PostUserInterfacePass( renderable: mod_Renderable.IRenderable ): void { };
    protected OnRender_PostPostProcessPass( renderable: mod_Renderable.IRenderable ): void { };

    //////////////////////////////////////////////////////////////////////////
    // @brief Clear color and depth targets. Color target may be optionally
    //  filled with specified color.
    // @param color [in] Color to fill render target with.
    public Clear( color = mod_Color.FColor.Get( mod_Color.EColor.Black ) ): void
    {
        this.mContext.ClearRenderTarget( color );
        this.mContext.ClearDepth();
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Clear color target. The target may be optionally filled with
    //  specified color.
    // @param color [in] Color to fill render target with.
    public ClearTarget( color = mod_Color.FColor.Get( mod_Color.EColor.Black ) ): void
    {
        this.mContext.ClearRenderTarget( color );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Clear depth target. The target will be filled with ones (1).
    public ClearDepth(): void
    {
        this.mContext.ClearDepth();
    };
};
