
export class CRenderTarget
{
    private mRenderTarget: WebGLTexture;
    private mRenderTargetView: WebGLFramebuffer;


    //////////////////////////////////////////////////////////////////////////
    public constructor(
        gl: WebGLRenderingContext,
        width: number,
        height: number,
        format: number,
        type: number )
    {
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
            throw Error( "Failed to create render target" );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public BindRenderTarget( gl: WebGLRenderingContext ): void
    {
        gl.bindFramebuffer( gl.FRAMEBUFFER, this.mRenderTargetView );
    };

    //////////////////////////////////////////////////////////////////////////
    public BindTexture( gl: WebGLRenderingContext, slot: number ): void
    {
        gl.activeTexture( gl.TEXTURE0 + slot );
        gl.bindTexture( gl.TEXTURE_2D, this.mRenderTarget );
    };
};
