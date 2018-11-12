import { mod_Renderable } from "./index";
import { mod_Color } from "./../core/index";
import { CContext } from "./context";
import { CProgram, EUniform, ETexture } from "./program";
import { ERenderPass } from "./renderable";
import { CUserInterfaceProgram } from "../shaders/user_interface";
import { CPostProcessProgram } from "../shaders/post_process";
import { CGeometryProgram } from "../shaders/geometry";
import { CRenderTarget } from "./render_target";
import { CRectangle } from "../geometry/2d/rectangle";
import { CRectangleFactory } from "../geometry/2d/rectangle_factory";
import { FColor, EColor } from "../core/color";


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
    protected mUserInterfaceProgram: CProgram;
    protected mPostProcessProgram: CProgram;
    protected mUserInterfaceBlendEnable: boolean;
    protected mColorRenderTarget: CRenderTarget;
    protected mUserInterfaceRenderTarget: CRenderTarget;
    protected mFrame: CRectangle;
    protected mClearColor: FColor;
    protected mInvFrameSizeUniformData: number[];


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

        this.mUserInterfaceBlendEnable = false;
        
        this.mColorRenderTarget = new CRenderTarget(
            context, "ColorRT", canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE );

        this.mUserInterfaceRenderTarget = new CRenderTarget(
            context, "UIRT", canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE );
        
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

        this.mClearColor =
            FColor.Get( EColor.Black );

        this.mInvFrameSizeUniformData = new Array<number>();
        this.mInvFrameSizeUniformData.push( 1 / this.mFrameViewport.Width );
        this.mInvFrameSizeUniformData.push( 1 / this.mFrameViewport.Height );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Render instance of renderable object. The renderer runs whole
    //  rendering pipeline for the object.
    // @param renderable [in] Instance of object to render.
    public Render( renderable: mod_Renderable.IRenderable ): void
    {
        let transparentClearColor = new FColor(
            this.mClearColor.r,
            this.mClearColor.g,
            this.mClearColor.b, 0 );

        // Color PASS
        this.mContext.SetProgram( this.mGeometryProgram );
        this.mContext.SetViewport( this.mFrameViewport );
        this.mContext.SetRenderTargets( 1, [this.mColorRenderTarget] );
        this.mContext.SetUniform2fv( EUniform.InvFrameSize, this.mInvFrameSizeUniformData );
        this.mContext.SetUniform1i( EUniform.UseAlphaTexture, 0 );
        this.Clear( this.mClearColor );

        this.OnRender_PreGeometryPass( renderable );
        renderable.Render( this.mContext, ERenderPass.Geometry );
        this.OnRender_PostGeometryPass( renderable );
        
        // User interface PASS
        this.mContext.SetProgram( this.mUserInterfaceProgram );
        this.mContext.SetRenderTargets( 1, [this.mUserInterfaceRenderTarget] );
        this.mContext.SetUniform2fv( EUniform.InvFrameSize, this.mInvFrameSizeUniformData );
        this.mContext.SetUniform1i( EUniform.UseAlphaTexture, 0 );
        this.Clear( transparentClearColor );

        this.OnRender_PreUserInterfacePass( renderable );
        renderable.Render( this.mContext, ERenderPass.UserInterface );
        this.OnRender_PostUserInterfacePass( renderable );
        
        // Post process PASS
        this.mContext.SetProgram( this.mPostProcessProgram );
        this.mContext.SetRenderTargets( 1, [null] );
        this.mContext.SetTexture( ETexture.Color, this.mColorRenderTarget.GetTextureView() );
        this.mContext.SetTexture( ETexture.Color + 1, this.mUserInterfaceRenderTarget.GetTextureView() );
        this.mContext.SetUniform2fv( EUniform.InvFrameSize, this.mInvFrameSizeUniformData );
        this.Clear( this.mClearColor );

        this.OnRender_PrePostProcessPass( renderable );
        this.mFrame.Render( this.mContext, ERenderPass.PostProcessing );
        this.OnRender_PostPostProcessPass( renderable );

        // Cleanup
        this.mContext.SetTexture( ETexture.Color, null );
        this.mContext.SetTexture( ETexture.Color + 1, null );
    };

    // Extensions
    protected OnRender_PreGeometryPass( renderable: mod_Renderable.IRenderable ): void { };
    protected OnRender_PreUserInterfacePass( renderable: mod_Renderable.IRenderable ): void { };
    protected OnRender_PrePostProcessPass( renderable: mod_Renderable.IRenderable ): void { };
    protected OnRender_PostGeometryPass( renderable: mod_Renderable.IRenderable ): void { };
    protected OnRender_PostUserInterfacePass( renderable: mod_Renderable.IRenderable ): void { };
    protected OnRender_PostPostProcessPass( renderable: mod_Renderable.IRenderable ): void { };

    //////////////////////////////////////////////////////////////////////////
    // @brief Clear color and depth targets. Color target may be optionally
    //  filled with specified color.
    // @param color [in] Color to fill render target with.
    public Clear( color = mod_Color.FColor.Get( mod_Color.EColor.Black ) ): void
    {
        this.mContext.Clear( color, 1 );
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
        this.mContext.ClearDepth( 1 );
    };
};
