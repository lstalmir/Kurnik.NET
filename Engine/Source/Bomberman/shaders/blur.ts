import { CProgram, ETexture, EUniform, EAttribute } from "../../game_engine/rendering/program";

export abstract class FGaussianBlurShaders
{
    private static VertexShaderCode: string =
        'precision mediump float;' +
        'attribute vec3 aPosition;' +
        'attribute vec2 aTexcoord;' +
        'attribute vec3 aInstancePosition;' +
        'attribute vec2 aInstanceTexcoord;' +
        'varying vec2 vTexcoord;' +
        'void main( void ) {' +
        '   gl_Position = vec4( aPosition.xy, 0.0, 1.0 );' +
        '   vTexcoord = aTexcoord;' +
        '}';

    private static PixelShaderCode: string =
        'precision mediump float;' +
        'varying vec2 vTexcoord;' +
        'uniform vec2 uInvFrameSize;' +
        'uniform vec2 uPixelOffset;' +
        'uniform sampler2D tFrameTex;' +

        'vec4 blur5() {' +
        '   vec4 outColor = vec4( 0, 0, 0, 0 );' +
        '   vec2 off1 = 1.3333333333333333 * uPixelOffset * uInvFrameSize;' +
        '   outColor += texture2D( tFrameTex, vTexcoord ) * 0.29411764705882354;' +
        '   outColor += texture2D( tFrameTex, vTexcoord + off1 ) * 0.35294117647058826;' +
        '   outColor += texture2D( tFrameTex, vTexcoord - off1 ) * 0.35294117647058826;' +
        '   return outColor;' +
        '}' +

        'vec4 blur9() {' +
        '   vec4 outColor = vec4( 0, 0, 0, 0 );' +
        '   vec2 off1 = 1.3846153846 * uPixelOffset * uInvFrameSize;' +
        '   vec2 off2 = 3.2307692308 * uPixelOffset * uInvFrameSize;' +
        '   outColor += texture2D( tFrameTex, vTexcoord ) * 0.2270270270;' +
        '   outColor += texture2D( tFrameTex, vTexcoord + off1 ) * 0.3162162162;' +
        '   outColor += texture2D( tFrameTex, vTexcoord - off1 ) * 0.3162162162;' +
        '   outColor += texture2D( tFrameTex, vTexcoord + off2 ) * 0.0702702703;' +
        '   outColor += texture2D( tFrameTex, vTexcoord - off2 ) * 0.0702702703;' +
        '   return outColor;' +
        '}' +
        
        'void main( void ) {' +
        '   gl_FragColor = blur9();' +
        '}';


    //////////////////////////////////////////////////////////////////////////
    // @brief Get vertex shader code for user interface program.
    // @return Vertex shader code.
    public static GetVertexShaderCode(): string
    {
        return FGaussianBlurShaders.VertexShaderCode;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get pixel (fragment) shader code for user interface program.
    // @return Pixel shader code.
    public static GetPixelShaderCode(): string
    {
        return FGaussianBlurShaders.PixelShaderCode;
    };
};

export class CBlurProgram extends CProgram
{
    public constructor( gl: WebGLRenderingContext, name: string )
    {
        super( gl, name, FGaussianBlurShaders.GetVertexShaderCode(), FGaussianBlurShaders.GetPixelShaderCode() );

        this.QueryAttributeLocation( gl, "aPosition", EAttribute.Position );
        this.QueryAttributeLocation( gl, "aTexcoord", EAttribute.Texcoord );
        this.QueryAttributeLocation( gl, "aInstancePosition", EAttribute.InstancePosition );
        this.QueryAttributeLocation( gl, "aInstanceTexcoord", EAttribute.InstanceTexcoord );

        this.QueryTextureLocation( gl, "tFrameTex", ETexture.Color );

        this.QueryUniformLocation( gl, "uInvFrameSize", EUniform.InvFrameSize );
        this.QueryUniformLocation( gl, "uPixelOffset", EUniform.BlurPixelOffset );
    };
};
