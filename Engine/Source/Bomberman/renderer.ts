import { CRenderer, FViewport } from "../game_engine/rendering/renderer";
import { CProgram, EUniform } from "../game_engine/rendering/program";
import { CRenderTarget } from "../game_engine/rendering/render_target";
import { IRenderable, ERenderPass } from "../game_engine/rendering/renderable";
import { CContext } from "../game_engine/rendering/context";
import { FGaussianBlurShaders, CBlurProgram } from "./shaders/blur";
import { FTargetCopyShaders, CTargetCopyProgram } from "./shaders/target_copy";

export class CBombermanRenderer extends CRenderer
{
    protected mBlurEnabled: boolean;
    protected mBlurProgram: CProgram;
    protected mBlurTempRenderTargets: CRenderTarget[];
    protected mBlurTempRenderTargetSizeFactor: number;
    protected mBlurFrameViewport: FViewport;
    protected mBlurPasses: number;
    protected mBlurStrength: number;

    protected mTargetCopyProgram: CProgram;


    public constructor( context: CContext )
    {
        super( context );
        let gl = context.GetGLContext();

        this.mBlurEnabled = false;
        this.mBlurTempRenderTargetSizeFactor = 0.5;
        this.mBlurPasses = 2;
        this.mBlurStrength = 1;

        this.mBlurProgram = new CBlurProgram( gl, "BLUR-PROGRAM" );
        this.mTargetCopyProgram = new CTargetCopyProgram( gl, "TARGET-COPY-PROGRAM" );

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
    }

    public SetBlurEnable( enable: boolean ): void
    {
        this.mBlurEnabled = enable;
    };

    public SetBlurStrength( strength: number ): void
    {
        this.mBlurStrength = strength;
    };

    protected OnRender_PostGeometryPass( renderable: IRenderable ): void
    {
        let gl = this.mContext.GetGLContext();

        if ( this.mBlurEnabled && this.mBlurStrength > 0 )
        {
            this.mContext.SetProgram( this.mBlurProgram );
            this.mContext.SetViewport( this.mBlurFrameViewport );

            gl.uniform2f(
                this.mBlurProgram.GetUniformLocation( EUniform.InvFrameSize ),
                1 / this.mBlurFrameViewport.Width,
                1 / this.mBlurFrameViewport.Height );

            for ( let i = 0; i < this.mBlurPasses; ++i )
            {
                this.mContext.SetRenderTargets( 1, [this.mBlurTempRenderTargets[0]] );
                if ( i == 0 )
                    this.mColorRenderTarget.BindTexture( this.mContext, 0 );
                else
                    this.mBlurTempRenderTargets[1].BindTexture( this.mContext, 0 );
                this.Clear();

                gl.uniform2f(
                    this.mBlurProgram.GetUniformLocation( EUniform.BlurPixelOffset ),
                    0, this.mBlurStrength );

                this.mFrame.Render( this.mContext, ERenderPass.PostProcessing );

                this.mContext.SetRenderTargets( 1, [this.mBlurTempRenderTargets[1]] );
                this.mBlurTempRenderTargets[0].BindTexture( this.mContext, 0 );
                this.Clear();

                gl.uniform2f(
                    this.mBlurProgram.GetUniformLocation( EUniform.BlurPixelOffset ),
                    this.mBlurStrength, 0 );

                this.mFrame.Render( this.mContext, ERenderPass.PostProcessing );
            }

            this.mContext.SetProgram( this.mTargetCopyProgram );

            this.mBlurTempRenderTargets[1].BindTexture( this.mContext, 0 );
            this.mContext.SetRenderTargets( 1, [this.mColorRenderTarget] );
            this.mContext.SetViewport( this.mFrameViewport );
            this.Clear();
            
            gl.uniform2f(
                this.mBlurProgram.GetUniformLocation( EUniform.InvFrameSize ),
                1 / this.mFrameViewport.Width,
                1 / this.mFrameViewport.Height );

            gl.uniform2f(
                this.mBlurProgram.GetUniformLocation( EUniform.BlurPixelOffset ),
                0, 0 );

            this.mFrame.Render( this.mContext, ERenderPass.PostProcessing );
        }
    };
};
