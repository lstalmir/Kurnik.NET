import { CRenderer, FViewport } from "../game_engine/rendering/renderer";
import { CProgram, EUniform, ETexture } from "../game_engine/rendering/program";
import { CRenderTarget } from "../game_engine/rendering/render_target";
import { IRenderable, ERenderPass } from "../game_engine/rendering/renderable";
import { CContext } from "../game_engine/rendering/context";
import { CBlurProgram } from "./shaders/blur";
import { CTargetCopyProgram } from "./shaders/target_copy";
import { CUserInterfaceProgram } from "./shaders/user_interface";
import { CPostProcessProgram } from "./shaders/post_process";
import { EBombermanUniform } from "./shaders/shader_constants";
import { CGeometryProgram } from "./shaders/geometry";
import { CTexture2D } from "../game_engine/engine/texture";
import { FColor, EColor } from "../game_engine/core/color";
import { CRectangle } from "../game_engine/geometry/2d/rectangle";
import { CRectangleFactory } from "../game_engine/geometry/2d/rectangle_factory";

export class CBombermanRenderer extends CRenderer
{
    protected mBlurEnabled: boolean;
    protected mBlurProgram: CProgram;
    protected mBlurTempRenderTargets: CRenderTarget[];
    protected mBlurTempRenderTargetSizeFactor: number;
    protected mBlurFrameViewport: FViewport;
    protected mBlurInvFrameSizeUniformData: number[];
    protected mBlurPasses: number;
    protected mBlurStrength: number;

    protected mTargetCopyProgram: CProgram;
    protected mWorldFrame: CRectangle;
    protected mBomberpersonBackground: CTexture2D;


    public constructor( context: CContext )
    {
        super( context );
        let gl = context.GetGLContext();

        this.mBlurEnabled = false;
        this.mBlurTempRenderTargetSizeFactor = 1;
        this.mBlurPasses = 2;
        this.mBlurStrength = 1;

        this.mBlurProgram = new CBlurProgram( gl, "BLUR-PROGRAM" );
        this.mTargetCopyProgram = new CTargetCopyProgram( gl, "TARGET-COPY-PROGRAM" );
        this.mGeometryProgram = new CGeometryProgram( gl, "GEOMETRY-PROGRAM" );
        this.mUserInterfaceProgram = new CUserInterfaceProgram( gl, "USER-INTERFACE-PROGRAM" );
        this.mPostProcessProgram = new CPostProcessProgram( gl, "POST-PROCESS-PROGRAM" );

        this.mBlurTempRenderTargets = new Array<CRenderTarget>();

        for ( let i = 0; i < 2; ++i )
        {
            this.mBlurTempRenderTargets.push( new CRenderTarget(
                context,
                "BLUR-TEMP-RENDER-TARGET-" + i.toString(),
                context.GetCanvas().width * this.mBlurTempRenderTargetSizeFactor,
                context.GetCanvas().height * this.mBlurTempRenderTargetSizeFactor,
                gl.RGBA,
                gl.UNSIGNED_BYTE ) );
        }

        this.mBlurFrameViewport = new FViewport(
            0, 0,
            context.GetCanvas().width * this.mBlurTempRenderTargetSizeFactor,
            context.GetCanvas().height * this.mBlurTempRenderTargetSizeFactor,
            0, 1 );

        this.mBlurInvFrameSizeUniformData = new Array<number>();
        this.mBlurInvFrameSizeUniformData.push( 1 / this.mBlurFrameViewport.Width );
        this.mBlurInvFrameSizeUniformData.push( 1 / this.mBlurFrameViewport.Height );
        
        this.mBomberpersonBackground = new CTexture2D(
            context,
            "/images/background.png" );

        this.mWorldFrame =
            new CRectangleFactory()
                .SetWidth( 1.390625 )
                .SetHeight( 1.722222 )
                .SetX( -0.921875 )
                .SetY( -0.861111 )
                .SetName( "WORLD-FRAME" )
                .SetRenderFlag( ERenderPass.PostProcessing )
                .Create( context );
        
        this.mClearColor =
            FColor.Get( EColor.White );
    }

    public SetBlurEnable( enable: boolean ): void
    {
        this.mBlurEnabled = enable;
    };

    public SetBlurStrength( strength: number ): void
    {
        this.mBlurStrength = strength;
    };
        
    protected OnRender_PrePostProcessPass( renderable: IRenderable ): void
    {
        this.mContext.SetTexture( ETexture.Color + 2, this.mBomberpersonBackground.GetView() );
        this.mContext.SetUniform1i( EBombermanUniform.PostProcessPass, 0 );

        if ( this.mBlurEnabled && this.mBlurStrength > 0 )
        {
            this.mContext.SetRenderTargets( 1, [this.mBlurTempRenderTargets[1]] );
            this.Clear( this.mClearColor );
        }
    };

    protected OnRender_PostPostProcessPass( renderable: IRenderable ): void
    {
        this.mContext.SetUniform1i( EBombermanUniform.PostProcessPass, 1 );
        this.mWorldFrame.Render( this.mContext, ERenderPass.PostProcessing );

        if ( this.mBlurEnabled && this.mBlurStrength > 0 )
        {
            this.mContext.SetProgram( this.mBlurProgram );
            this.mContext.SetViewport( this.mBlurFrameViewport );
            this.mContext.SetUniform2fv( EUniform.InvFrameSize, this.mBlurInvFrameSizeUniformData );

            for ( let i = 0; i < this.mBlurPasses; ++i )
            {
                this.mContext.SetRenderTargets( 1, [this.mBlurTempRenderTargets[0]] );
                this.mContext.SetTexture( ETexture.Color, this.mBlurTempRenderTargets[1].GetTextureView() );
                this.Clear();

                this.mContext.SetUniform2f( EBombermanUniform.BlurPixelOffset, 0, this.mBlurStrength );

                this.mFrame.Render( this.mContext, ERenderPass.PostProcessing );

                this.mContext.SetRenderTargets( 1, [this.mBlurTempRenderTargets[1]] );
                this.mContext.SetTexture( ETexture.Color, this.mBlurTempRenderTargets[0].GetTextureView() );
                this.Clear();

                this.mContext.SetUniform2f( EBombermanUniform.BlurPixelOffset, this.mBlurStrength, 0 );

                this.mFrame.Render( this.mContext, ERenderPass.PostProcessing );
            }

            this.mContext.SetProgram( this.mTargetCopyProgram );
            this.mContext.SetRenderTargets( 1, [null] );
            this.mContext.SetTexture( ETexture.Color, this.mBlurTempRenderTargets[1].GetTextureView() );
            this.mContext.SetViewport( this.mFrameViewport );
            this.Clear( this.mClearColor );

            this.mFrame.Render( this.mContext, ERenderPass.PostProcessing );
        }
    };
};
