import { mod_Renderable } from "./index";
import { mod_Color } from "./../core/index";
import { CContext } from "./context";
import { CProgram, EUniform } from "./program";
import { ERenderPass } from "./renderable";
import { FUserInterfaceShaders } from "../shaders/user_interface";
import { FPostProcessShaders } from "../shaders/post_process";
import { FGeometryShaders } from "../shaders/geometry";
import { FLightingShaders } from "../shaders/lighting";
import { CRenderTarget } from "./render_target";
import { CRectangle } from "../geometry/2d/rectangle";
import { CRectangleFactory } from "../geometry/2d/rectangle_factory";


class FViewport
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
    private mContext: CContext;
    private mFrameViewport: FViewport;
    private mGeometryProgram: CProgram;
    private mLightingProgram: CProgram;
    private mUserInterfaceProgram: CProgram;
    private mPostProcessProgram: CProgram;
    private mUserInterfaceBlendEnable: boolean;
    private mColorRenderTarget: CRenderTarget;
    private mDepthRenderTarget: CRenderTarget;
    private mFrameRenderTarget: CRenderTarget;
    private mFrame: CRectangle;


    //////////////////////////////////////////////////////////////////////////
    // @brief Construct new renderer instance.
    // @param context [in] Instance of WebGL rendering context wrapper.
    constructor( context: CContext )
    {
        this.mContext = context;
        var gl = context.GetGLContext();

        var canvas = this.mContext.GetCanvas();
        this.mFrameViewport = new FViewport( 0, 0, canvas.width, canvas.height, 0, 1 );

        this.mGeometryProgram = new CProgram(
            gl,
            "GeometryProgram",
            FGeometryShaders.GetVertexShaderCode(),
            FGeometryShaders.GetPixelShaderCode());

        this.mLightingProgram = new CProgram(
            gl,
            "LightingProgram",
            FLightingShaders.GetVertexShaderCode(),
            FLightingShaders.GetPixelShaderCode() );
        
        this.mUserInterfaceProgram = new CProgram(
            gl,
            "UserInterfaceProgram",
            FUserInterfaceShaders.GetVertexShaderCode(),
            FUserInterfaceShaders.GetPixelShaderCode() );

        this.mPostProcessProgram = new CProgram(
            gl,
            "PostProcessProgram",
            FPostProcessShaders.GetVertexShaderCode(),
            FPostProcessShaders.GetPixelShaderCode() );
        
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
        this.mColorRenderTarget.BindRenderTarget( this.mContext );
        this.Clear();

        gl.viewport(
            this.mFrameViewport.X,
            this.mFrameViewport.Y,
            this.mFrameViewport.Width,
            this.mFrameViewport.Height );

        gl.uniform2f(
            this.mGeometryProgram.GetUniformLocation( EUniform.InvFrameSize ),
            1 / this.mFrameViewport.Width,
            1 / this.mFrameViewport.Height );
        gl.uniform1i(
            this.mGeometryProgram.GetUniformLocation( EUniform.UseAlphaTexture ),
            0 );

        renderable.Render( this.mContext, ERenderPass.Geometry );

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
        this.mFrameRenderTarget.BindRenderTarget( this.mContext );
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
        
        if ( this.mUserInterfaceBlendEnable )
        {
            gl.disable( gl.BLEND );
        }
        
        // Post process
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        this.mContext.SetProgram( this.mPostProcessProgram );
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
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Clear color and depth targets. Color target may be optionally
    //  filled with specified color.
    // @param color [in] Color to fill render target with.
    public Clear( color = mod_Color.FColor.Get( mod_Color.EColor.Black ) ): void
    {
        var gl = this.mContext.GetGLContext();

        gl.clearColor( color.r, color.g, color.b, color.a );
        gl.clearDepth( this.mFrameViewport.DepthMax );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        this.mContext.GetDebug().Log(
            'Render target clear ('
            + color.r + ', '
            + color.g + ', '
            + color.b + ', '
            + color.a + ')' );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Clear color target. The target may be optionally filled with
    //  specified color.
    // @param color [in] Color to fill render target with.
    public ClearTarget( color = mod_Color.FColor.Get( mod_Color.EColor.Black ) ): void
    {
        var gl = this.mContext.GetGLContext();

        gl.clearColor( color.r, color.g, color.b, color.a );
        gl.clear( gl.COLOR_BUFFER_BIT );

        this.mContext.GetDebug().Log(
            'Render target color clear ('
            + color.r + ', '
            + color.g + ', '
            + color.b + ', '
            + color.a + ')' );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Clear depth target. The target will be filled with ones (1).
    public ClearDepth(): void
    {
        var gl = this.mContext.GetGLContext();

        gl.clearDepth( this.mFrameViewport.DepthMax );
        gl.clear( gl.DEPTH_BUFFER_BIT );

        this.mContext.GetDebug().Log(
            'Render target depth clear' );
    };
};
