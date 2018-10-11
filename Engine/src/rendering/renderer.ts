import { mod_Renderable } from "./index";
import { mod_Color } from "./../core/index";
import { CContext } from "./context";
import { EAttribute, CProgram } from "./program";
import { FVertex } from "../game/vertex";
import { ERenderPass } from "./renderable";
import { FUserInterfaceShaders } from "../shaders/user_interface";
import { FPostProcessShaders } from "../shaders/post_process";
import { CRenderTarget } from "./render_target";
import { CRectangle } from "../geometry/2d/rectangle";


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
    private mGL: WebGLRenderingContext;
    private mContext: CContext;
    private mFrameViewport: FViewport;
    private mGeometryProgram: CProgram;
    private mLightingProgram: CProgram;
    private mUserInterfaceProgram: CProgram;
    private mPostProcessProgram: CProgram;
    private mUserInterfaceBlendEnable: boolean;
    private mGBufferRenderTarget: CRenderTarget;
    private mFrameRenderTarget: CRenderTarget;
    private mFrame: CRectangle;


    //////////////////////////////////////////////////////////////////////////
    // @brief Construct new renderer instance.
    // @param context [in] Instance of WebGL rendering context wrapper.
    constructor( context: CContext )
    {
        this.mContext = context;
        this.mGL = context.GetGLContext();

        var canvas = this.mContext.GetCanvas();
        this.mFrameViewport = new FViewport( 0, 0, canvas.width, canvas.height, 0, 1 );
        
        this.mUserInterfaceProgram = new CProgram(
            this.mGL,
            FUserInterfaceShaders.GetVertexShaderCode(),
            FUserInterfaceShaders.GetPixelShaderCode() );

        this.mPostProcessProgram = new CProgram(
            this.mGL,
            FPostProcessShaders.GetVertexShaderCode(),
            FPostProcessShaders.GetPixelShaderCode() );

        this.mGBufferRenderTarget = new CRenderTarget(
            this.mGL, canvas.width * 2, canvas.height * 2, this.mGL.RGBA, this.mGL.UNSIGNED_BYTE );

        this.mFrameRenderTarget = new CRenderTarget(
            this.mGL, canvas.width, canvas.height, this.mGL.RGBA, this.mGL.UNSIGNED_BYTE );

        this.mFrame = new CRectangle( this.mContext, "FRAME", canvas.width, canvas.height );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Render instance of renderable object. The renderer runs whole
    //  rendering pipeline for the object.
    // @param renderable [in] Instance of object to render.
    public Render( renderable: mod_Renderable.IRenderable ): void
    {
        // Setup viewport
        this.mGL.viewport(
            this.mFrameViewport.X,
            this.mFrameViewport.Y,
            this.mFrameViewport.Width,
            this.mFrameViewport.Height );

        // Geometry
        this.mContext.SetProgram( this.mGeometryProgram );
        this.mGBufferRenderTarget.BindRenderTarget( this.mGL );

        renderable.Render( this.mContext, ERenderPass.Geometry );

        // Lighting
        this.mContext.SetProgram( this.mLightingProgram );
        this.mGBufferRenderTarget.BindTexture( this.mGL, 0 );
        this.mFrameRenderTarget.BindRenderTarget( this.mGL );

        this.mFrame.Render( this.mContext, ERenderPass.Lighting );

        // User interface
        this.mContext.SetProgram( this.mUserInterfaceProgram );

        if ( this.mUserInterfaceBlendEnable )
        {
            this.mGL.enable( this.mGL.BLEND );
            this.mGL.disable( this.mGL.DEPTH_TEST );
            this.mGL.blendFunc( this.mGL.SRC_ALPHA, this.mGL.ONE );
        }

        renderable.Render( this.mContext, ERenderPass.UserInterface );
        
        if ( this.mUserInterfaceBlendEnable )
        {
            this.mGL.disable( this.mGL.BLEND );
        }

        // Post process
        this.mContext.SetProgram( this.mPostProcessProgram );
        this.mFrameRenderTarget.BindTexture( this.mGL, 0 );
        this.mGL.bindFramebuffer( this.mGL.FRAMEBUFFER, null );

        this.mFrame.Render( this.mContext, ERenderPass.PostProcessing );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Clear color and depth targets. Color target may be optionally
    //  filled with specified color.
    // @param color [in] Color to fill render target with.
    public Clear( color = mod_Color.FColor.Get( mod_Color.EColor.Black ) ): void
    {
        this.mGL.clearColor( color.r, color.g, color.b, color.a );
        this.mGL.clearDepth( this.mFrameViewport.DepthMax );
        this.mGL.clear( this.mGL.COLOR_BUFFER_BIT | this.mGL.DEPTH_BUFFER_BIT );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Clear color target. The target may be optionally filled with
    //  specified color.
    // @param color [in] Color to fill render target with.
    public ClearTarget( color = mod_Color.FColor.Get( mod_Color.EColor.Black ) ): void
    {
        this.mGL.clearColor( color.r, color.g, color.b, color.a );
        this.mGL.clear( this.mGL.COLOR_BUFFER_BIT );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Clear depth target. The target will be filled with ones (1).
    public ClearDepth(): void
    {
        this.mGL.clearDepth( this.mFrameViewport.DepthMax );
        this.mGL.clear( this.mGL.DEPTH_BUFFER_BIT );
    };
};
