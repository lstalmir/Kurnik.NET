import { CContext } from "../rendering/context";

export interface ITexture { Bind( gl: WebGLRenderingContext, uniform: WebGLUniformLocation, slot: number ): void; };
export interface ITexture1D extends ITexture { Width: number; };
export interface ITexture2D extends ITexture1D { Height: number; };
export interface ITexture3D extends ITexture2D { Depth: number; };


export class CTexture implements ITexture
{
    protected mTextureView: WebGLTexture;
    protected mDimension: number;
    protected mGLDimension: number;

    //////////////////////////////////////////////////////////////////////////
    // @brief Create new texture object.
    // @param context [in] Instance of WebGL rendering context wrapper.
    public constructor( context: CContext, dimension: number, path: string )
    {
        let gl = context.GetGLContext();
        this.mDimension = dimension;
        this.mGLDimension = this.GetWebGLDimension( gl );
        
        // Check if texture dimension is supported.
        if ( this.mGLDimension == 0 )
            throw Error( "Requested texture dimension is not supported" );

        let texture = this;
        let image = new Image();
        image.onload = function ()
        {
            texture.OnTextureLoad( gl, image );
        };
        image.src = path;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Bind texture to the specified texture slot in the shader.
    // @param gl [in] Instance of WebGL rendering context.
    // @param slot [in] Index at which the texture should be available.
    public Bind( gl: WebGLRenderingContext, uniform: WebGLUniformLocation, slot: number ): void
    {
        gl.activeTexture( gl.TEXTURE0 + slot );
        gl.bindTexture( this.mGLDimension, this.mTextureView );
        gl.uniform1i( uniform, slot );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Translate internal dimension into WebGL texture dimension 
    //  constant.
    // @param gl [in] The rendering context with valid GL constants.
    protected GetWebGLDimension( gl: WebGLRenderingContext | WebGL2RenderingContext ): number
    {
        switch ( this.mDimension )
        {
            case 1:
                return gl.TEXTURE;
            case 2:
                return gl.TEXTURE_2D;
            case 3:
                // 3D texture support is available since WebGL2
                if ( gl instanceof WebGL2RenderingContext )
                    return gl.TEXTURE_3D;
        }
        return 0;
    };

    //////////////////////////////////////////////////////////////////////////
    protected OnTextureLoad( gl: WebGLRenderingContext, image: HTMLImageElement ): void
    {
        this.mTextureView = gl.createTexture();

        gl.bindTexture( gl.TEXTURE_2D, this.mTextureView );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );

        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.bindTexture( gl.TEXTURE_2D, null );
    };
};


export class CTexture1D extends CTexture implements ITexture1D
{
    public Width: number;

    public constructor( context: CContext, path: string )
    {
        super( context, 1, path );
        this.Width = 0;
    };

    protected OnTextureLoad( gl: WebGLRenderingContext, image: HTMLImageElement ): void
    {
        super.OnTextureLoad( gl, image );
        this.Width = image.width;
    };
};

export class CTexture2D extends CTexture implements ITexture2D
{
    public Width: number;
    public Height: number;

    public constructor( context: CContext, path: string )
    {
        super( context, 2, path );
        this.Width = 0;
        this.Height = 0;
    };

    protected OnTextureLoad( gl: WebGLRenderingContext, image: HTMLImageElement ): void
    {
        super.OnTextureLoad( gl, image );
        this.Width = image.width;
        this.Height = image.height;
    };
};

export class CTexture3D extends CTexture implements ITexture3D
{
    public Width: number;
    public Height: number;
    public Depth: number;

    public constructor( context: CContext, path: string )
    {
        super( context, 3, path );
        this.Width = 0;
        this.Height = 0;
        this.Depth = 0;
    };

    protected OnTextureLoad( gl: WebGLRenderingContext, image: HTMLImageElement ): void
    {
        super.OnTextureLoad( gl, image );
        this.Width = image.width;
        this.Height = image.height;
        this.Depth = 1;
    };
};
