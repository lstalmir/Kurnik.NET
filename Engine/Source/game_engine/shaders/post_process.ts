import { CProgram, EAttribute, ETexture, EUniform } from "../rendering/program";

export abstract class FPostProcessShaders
{
    private static VertexShaderCode: string =
        'precision mediump float;' +
        'attribute vec3 aPosition;' +
        'attribute vec2 aTexcoord;' +
        'attribute vec3 aInstancePosition;' +
        'attribute vec2 aInstanceTexcoord;' +
        'varying vec2 vTexcoord;' +
        'uniform vec2 uInvFrameSize;' +
        'void main( void ) {' +
        '   gl_Position = vec4( aPosition.xy, 0.0, 1.0 );' +
        '   vTexcoord = aTexcoord;' +
        '}';

    private static PixelShaderCode: string =
        'precision mediump float;' +
        'varying vec2 vTexcoord;' +
        'uniform sampler2D tFrameTex;' +
        'void main( void ) {' +
        '   vec4 color = texture2D( tFrameTex, vTexcoord );' +
        '   gl_FragColor = color;' +
        '}';


    //////////////////////////////////////////////////////////////////////////
    // @brief Get vertex shader code for user interface program.
    // @return Vertex shader code.
    public static GetVertexShaderCode(): string
    {
        return FPostProcessShaders.VertexShaderCode;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get pixel (fragment) shader code for user interface program.
    // @return Pixel shader code.
    public static GetPixelShaderCode(): string
    {
        return FPostProcessShaders.PixelShaderCode;
    };
};

export class CPostProcessProgram extends CProgram
{
    public constructor( gl: WebGLRenderingContext, name: string )
    {
        super( gl, name, FPostProcessShaders.GetVertexShaderCode(), FPostProcessShaders.GetPixelShaderCode() );

        this.QueryAttributeLocation( gl, "aPosition", EAttribute.Position );
        this.QueryAttributeLocation( gl, "aTexcoord", EAttribute.Texcoord );
        this.QueryAttributeLocation( gl, "aInstancePosition", EAttribute.InstancePosition );
        this.QueryAttributeLocation( gl, "aInstanceTexcoord", EAttribute.InstanceTexcoord );

        this.QueryTextureLocation( gl, "tFrameTex", ETexture.Color );

        this.QueryUniformLocation( gl, "uInvFrameSize", EUniform.InvFrameSize );
    };
};
