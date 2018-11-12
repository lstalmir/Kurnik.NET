import { IDisposable } from "../core/disposable";
import { CContext } from "../rendering/context";
import { FVector2D } from "../core/math/vector2d";

export class CFont implements IDisposable
{
    private mFontTexture: WebGLTexture;
    private mTextureSize: FVector2D;

    public constructor( context: CContext, path: string )
    {
        let gl = context.GetGLContext();
        let font = this;

        let image = new Image();
        image.onload = function ()
        {
            font.OnFontTextureResponseReceive( gl, image );
        };
        image.src = path;
    };

    public Dispose( gl: WebGLRenderingContext ): void
    {
        gl.deleteTexture( this.mFontTexture );
    };

    public GetCharacterOffset( character: number ): number[]
    {
        // Font textures are 16x16 characters.
        let row = Math.floor( character / 16 );
        let col = Math.floor( character % 16 );
        return [col / 16, row / 16];
    };

    private OnFontTextureResponseReceive( gl: WebGLRenderingContext, image: HTMLImageElement ): void
    {
        this.mFontTexture = gl.createTexture();

        gl.bindTexture( gl.TEXTURE_2D, this.mFontTexture );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );

        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );

        this.mTextureSize = new FVector2D( 16, 16 );

        gl.bindTexture( gl.TEXTURE_2D, null );
    };
};
