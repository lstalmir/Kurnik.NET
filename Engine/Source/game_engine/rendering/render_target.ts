import { CContext } from "./context";
import { EUniform, ETexture } from "./program";

export class CRenderTarget
{
    private mName: string;
    private mRenderTarget: WebGLTexture;
    private mRenderTargetView: WebGLFramebuffer;


    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, name: string, width: number, height: number, format: number, type: number )
    {
        var gl = context.GetGLContext();

        this.mName = name;
        this.mRenderTarget = gl.createTexture();
        this.mRenderTargetView = gl.createFramebuffer();

        gl.bindTexture( gl.TEXTURE_2D, this.mRenderTarget );
        gl.texImage2D( gl.TEXTURE_2D, 0, format, width, height, 0, format, type, null );

        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

        gl.bindFramebuffer( gl.FRAMEBUFFER, this.mRenderTargetView );
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            this.mRenderTarget,
            0 );

        if ( gl.checkFramebufferStatus( gl.FRAMEBUFFER ) != gl.FRAMEBUFFER_COMPLETE )
        { // Call to framebufferTexture2D failed
            throw Error( "Failed to create render target: " + gl.getError() );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public GetRenderTargetView(): WebGLFramebuffer
    {
        return this.mRenderTargetView;
    };

    //////////////////////////////////////////////////////////////////////////
    public GetTextureView(): WebGLTexture
    {
        return this.mRenderTarget;
    };

    //////////////////////////////////////////////////////////////////////////
    public BindRenderTarget( context: CContext ): void
    {
        var gl = context.GetGLContext();

        gl.bindFramebuffer( gl.FRAMEBUFFER, this.mRenderTargetView );

        context.GetDebug().Log(
            'Render target ' + this.mName +
            ' set as target framebuffer' );
    };

    //////////////////////////////////////////////////////////////////////////
    public BindTexture( context: CContext, slot: number ): void
    {
        var gl = context.GetGLContext();

        gl.activeTexture( gl.TEXTURE0 + slot );
        gl.bindTexture( gl.TEXTURE_2D, this.mRenderTarget );
        gl.uniform1i( context.GetProgram().GetTextureLocation( ETexture.Color ), slot );

        context.GetDebug().Log(
            'Render target ' + this.mName +
            ' bound to texture slot ' + slot );
    };
};
