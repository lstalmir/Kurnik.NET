import { CContext } from "../rendering/context";

export class CTexture
{
    protected mTextureView: WebGLTexture;
    protected mDimension: number;
    protected mGLDimension: number;

    //////////////////////////////////////////////////////////////////////////
    // @brief Create new texture object.
    // @param context [in] Instance of WebGL rendering context wrapper.
    public constructor( context: CContext, dimension: number )
    {
        let gl = context.GetGLContext();
        this.mDimension = dimension;
        this.mGLDimension = this.GetWebGLDimension( gl );
        this.mTextureView = gl.createTexture();

        
        // Check if texture dimension is supported.
        if ( this.mGLDimension == 0 )
            throw Error( "Requested texture dimension is not supported" );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Bind texture to the specified texture slot in the shader.
    // @param gl [in] Instance of WebGL rendering context.
    // @param slot [in] Index at which the texture should be available.
    public Bind( gl: WebGLRenderingContext, slot: number ): void
    {
        gl.activeTexture( gl.TEXTURE0 + slot );
        gl.bindTexture( this.mGLDimension, this.mTextureView );
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
};

export class CTexture1D extends CTexture { public constructor( context: CContext ) { super( context, 1 ); }; };
export class CTexture2D extends CTexture { public constructor( context: CContext ) { super( context, 2 ); }; };
export class CTexture3D extends CTexture { public constructor( context: CContext ) { super( context, 3 ); }; };
