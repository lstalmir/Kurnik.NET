
export abstract class CShader
{
    protected mShader: WebGLShader;

    //////////////////////////////////////////////////////////////////////////
    public constructor( gl: WebGLRenderingContext, type: number, source: string )
    {
        this.mShader = gl.createShader( type );

        gl.shaderSource( this.mShader, source );
        gl.compileShader( this.mShader );

        if ( !gl.getShaderParameter( this.mShader, gl.COMPILE_STATUS ) )
        {
            alert( "An error occurred compiling the shaders: " + gl.getShaderInfoLog( this.mShader ) );
            gl.deleteShader( this.mShader );
            throw Error();
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public GetGLShader(): WebGLShader
    {
        return this.mShader;
    };
};


export class CVertexShader extends CShader
{
    //////////////////////////////////////////////////////////////////////////
    public constructor( gl: WebGLRenderingContext, source: string )
    {
        super( gl, gl.VERTEX_SHADER, source );
    };
};


export class CPixelShader extends CShader
{
    //////////////////////////////////////////////////////////////////////////
    public constructor( gl: WebGLRenderingContext, source: string )
    {
        super( gl, gl.FRAGMENT_SHADER, source );
    };
};
