import { CTexture2D, ITexture2D } from "./texture";
import { CContext } from "../rendering/context";
import { FVector2D } from "../core/math/vector2d";

export interface IAnimatedTexture2D extends ITexture2D
{
    FramesPerSecond: number;
    FrameStrideX: number;
    FrameStrideY: number;
    FrameCountX: number;
    FrameCountY: number;
};

export class CAnimatedTexture2D extends CTexture2D implements IAnimatedTexture2D
{
    public FramesPerSecond: number;
    public FrameStrideX: number;
    public FrameStrideY: number;
    public FrameCountX: number;
    public FrameCountY: number;

    //////////////////////////////////////////////////////////////////////////
    // @brief Create new animated texture object.
    // @param context [in] Instance of WebGL rendering context wrapper.
    public constructor( context: CContext, path: string, framesPerSecond: number, strideX: number, strideY: number )
    {
        super( context, path );
        this.FramesPerSecond = framesPerSecond;
        this.FrameStrideX = strideX;
        this.FrameStrideY = strideY;
        this.FrameCountX = 1;
        this.FrameCountY = 1;
    };

    //////////////////////////////////////////////////////////////////////////
    public GetFrameTexcoord( timeMS: number ): FVector2D
    {
        let frame = timeMS * 1000 * this.FramesPerSecond;
        let offsetX = frame % this.FrameCountX;
        let offsetY = Math.floor( frame / this.FrameCountX ) % this.FrameCountY;
        return new FVector2D( offsetX / this.FrameCountX, offsetY / this.FrameCountY );
    };

    //////////////////////////////////////////////////////////////////////////
    protected OnTextureLoad( gl: WebGLRenderingContext, image: HTMLImageElement ): void
    {
        super.OnTextureLoad( gl, image );
        this.FrameCountX = Math.max( 1, Math.floor( this.Width / this.FrameStrideX ) );
        this.FrameCountY = Math.max( 1, Math.floor( this.Height / this.FrameStrideY ) );
    };
};
