import { CVertexShader, CPixelShader } from "./shader";
import { InvalidArgumentException } from "../core/error";

export enum EAttribute
{
    Position,
    Texcoord,
    InstancePosition,
    InstanceTexcoord,

    USER_DEFINED
};

export enum EUniform
{
    ProjectionMatrix,
    ViewMatrix,
    ModelMatrix,
    InvFrameSize,
    UseDiffuseTexture,
    UseSpecularTexture,
    UseNormalTexture,
    UseAlphaTexture,
    ColorTexture,
    AlphaTexture,

    // Material uniforms

    MaterialDiffuseTexture,
    MaterialDiffuseColor,
    MaterialSpecularTexture,
    MaterialSpecularValue,
    MaterialSpecularExponent,
    MaterialNormalTexture,
    MaterialAlphaTexture,
    MaterialTransparency,

    RenderingPass,

    USER_DEFINED
};

export enum ETexture
{
    Color,
    Alpha,
    MaterialDiffuse,
    MaterialSpecular,
    MaterialNormal,
    MaterialAlpha,

    USER_DEFINED
};

export class CProgram
{
    protected mVS: CVertexShader;
    protected mPS: CPixelShader;
    protected mName: string;
    protected mProgram: WebGLProgram;
    protected mAttribLocations: number[];
    protected mUniformLocations: WebGLUniformLocation[];
    protected mTextureLocations: WebGLUniformLocation[];

    //////////////////////////////////////////////////////////////////////////
    /// @brief Create new rendering program.
    /// @param gl [in] WebGL rendering context.
    /// @param name [in] String name of the program to create.
    /// @param vsCode [in] Code of the vertex shader for the program.
    /// @param psCode [in] Code of the fragment shader for the program.
    /// @exception Error Raised when initialization of the WebGLProgram fails.
    public constructor( gl: WebGLRenderingContext, name: string, vsCode: string, psCode: string )
    {
        this.mName = name;
        this.mVS = new CVertexShader( gl, vsCode );
        this.mPS = new CPixelShader( gl, psCode );

        this.mProgram = gl.createProgram();
        gl.attachShader( this.mProgram, this.mVS.GetGLShader() );
        gl.attachShader( this.mProgram, this.mPS.GetGLShader() );
        gl.linkProgram( this.mProgram );

        if ( !gl.getProgramParameter( this.mProgram, gl.LINK_STATUS ) )
        {
            alert( 'Unable to initialize the shader program: ' +
                gl.getProgramInfoLog( this.mProgram ) );
            throw Error();
        }

        this.mAttribLocations = new Array<number>();
        this.mUniformLocations = new Array<WebGLUniformLocation>();
        this.mTextureLocations = new Array<WebGLUniformLocation>();
    };

    //////////////////////////////////////////////////////////////////////////
    /// @brief Get name of the program.
    /// @return String containing program name.
    public GetName(): string
    {
        return this.mName;
    };

    //////////////////////////////////////////////////////////////////////////
    public GetTextureLocation( slot: number ): WebGLUniformLocation
    {
        if ( slot >= this.mTextureLocations.length )
        {
            return null;
        }

        return this.mTextureLocations[slot];
    };

    //////////////////////////////////////////////////////////////////////////
    /// @brief Set uniform data for the program.
    /// @param location [in] Uniform location to set.
    /// @param data [in] Raw data to fill the uniform with.
    public SetUniform( gl: WebGLRenderingContext, uniform: EUniform, data: number[] ): void
    {
        var target = this.mUniformLocations[uniform];
        switch ( uniform )
        {
            // 4x4 matrices
            case EUniform.ModelMatrix:
            case EUniform.ProjectionMatrix:
            case EUniform.ViewMatrix:
                gl.uniformMatrix4fv( target, false, data );
                break;
        }
    };

    //////////////////////////////////////////////////////////////////////////
    /// @brief Get attribute location.
    /// @param attribute [in] Attribute to get location of.
    /// @return Location of the attribute.
    public GetAttributeLocation( attribute: EAttribute ): number
    {
        if ( attribute >= this.mAttribLocations.length )
        {
            return -1;
        }

        return this.mAttribLocations[attribute];
    };

    //////////////////////////////////////////////////////////////////////////
    /// @brief Get uniform location.
    /// @param uniform [in] Uniform to get location of.
    /// @return Location of the uniform.
    public GetUniformLocation( uniform: EUniform ): WebGLUniformLocation
    {
        if ( uniform >= this.mUniformLocations.length )
        {
            return null;
        }

        return this.mUniformLocations[uniform];
    };

    //////////////////////////////////////////////////////////////////////////
    /// @brief Set the program as currently used one.
    public Use( gl: WebGLRenderingContext ): void
    {
        gl.useProgram( this.mProgram );
    };

    //////////////////////////////////////////////////////////////////////////
    protected QueryAttributeLocation( gl: WebGLRenderingContext, attributeName: string, location: number ): void
    {
        if ( location >= this.mAttribLocations.length )
        {
            this.mAttribLocations.length = location + 1;
        }

        this.mAttribLocations[location] = gl.getAttribLocation( this.mProgram, attributeName );
    };

    //////////////////////////////////////////////////////////////////////////
    protected QueryUniformLocation( gl: WebGLRenderingContext, uniformName: string, location: number ): void
    {
        if ( location >= this.mUniformLocations.length )
        {
            this.mUniformLocations.length = location + 1;
        }

        this.mUniformLocations[location] = gl.getUniformLocation( this.mProgram, uniformName );
    };

    //////////////////////////////////////////////////////////////////////////
    protected QueryTextureLocation( gl: WebGLRenderingContext, textureName: string, location: number ): void
    {
        if ( location >= this.mTextureLocations.length )
        {
            this.mTextureLocations.length = location + 1;
        }

        this.mTextureLocations[location] = gl.getUniformLocation( this.mProgram, textureName );
    };
};
