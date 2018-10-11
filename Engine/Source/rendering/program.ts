import { CVertexShader, CPixelShader } from "./shader";

export enum EAttribute
{
    Position,
    Texcoord
};

export enum EUniform
{
    ProjectionMatrix,
    ViewMatrix,
    ModelMatrix
};

export class CProgram
{
    private mVS: CVertexShader;
    private mPS: CPixelShader;
    private mProgram: WebGLProgram;
    private mGL: WebGLRenderingContext;
    private mAttribLocations: number[];
    private mUniformLocations: WebGLUniformLocation[];

    //////////////////////////////////////////////////////////////////////////
    public constructor( gl: WebGLRenderingContext, vsCode: string, psCode: string )
    {
        this.mGL = gl;

        this.mVS = new CVertexShader( gl, vsCode );
        this.mPS = new CPixelShader( gl, psCode );

        this.mProgram = gl.createProgram();
        gl.attachShader( this.mProgram, this.mVS.GetGLShader() );
        gl.attachShader( this.mProgram, this.mPS.GetGLShader() );
        gl.linkProgram( this.mProgram );

        if ( !gl.getProgramParameter( this.mProgram, gl.LINK_STATUS ) )
        {
            alert( 'Unable to initialize the shader program: ' + gl.getProgramInfoLog( this.mProgram ) );
            throw Error();
        }

        this.mAttribLocations = new Array<number>();
        this.mAttribLocations.push( gl.getAttribLocation( this.mProgram, "aPosition" ) );
        this.mAttribLocations.push( gl.getAttribLocation( this.mProgram, "aTexcoord" ) );
        //this.mAttribLocations.push( gl.getAttribLocation( this.mProgram, "instance_position" ) );

        this.mUniformLocations = new Array<WebGLUniformLocation>();
        this.mUniformLocations.push( gl.getUniformLocation( this.mProgram, "uProjectionMatrix" ) );
        this.mUniformLocations.push( gl.getUniformLocation( this.mProgram, "uViewMatrix" ) );
        this.mUniformLocations.push( gl.getUniformLocation( this.mProgram, "uModelMatrix" ) );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set uniform data for the program.
    // @param location [in] Uniform location to set.
    // @param data [in] Raw data to fill the uniform with.
    public SetUniform( uniform: EUniform, data: number[] ): void
    {
        var target = this.mUniformLocations[uniform];
        switch ( uniform )
        {
            // 4x4 matrices
            case EUniform.ModelMatrix:
            case EUniform.ProjectionMatrix:
            case EUniform.ViewMatrix:
                this.mGL.uniform4fv( target, data );
                break;
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get attribute location.
    // @param attribute [in] Attribute to get location of.
    // @return Location of the attribute.
    public GetAttributeLocation( attribute: EAttribute ): number
    {
        return this.mAttribLocations[attribute];
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get uniform location.
    // @param uniform [in] Uniform to get location of.
    // @return Location of the uniform.
    public GetUniformLocation( uniform: EUniform ): WebGLUniformLocation
    {
        return this.mUniformLocations[uniform];
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set the program as currently used one.
    public Use(): void
    {
        this.mGL.useProgram( this.mProgram );
    };
};
