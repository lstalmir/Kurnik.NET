import { CProgram, EAttribute, ETexture, EUniform } from "../rendering/program";

abstract class FLightingShaders {
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
        'uniform sampler2D tMatDiffuseTex;' +
        'uniform sampler2D tMatAlphaTex;' +
        'uniform int bUseAlphaTex;' +
        'void main( void ) {' +
        '   vec4 color = texture2D( tMatDiffuseTex, vTexcoord );' +
        '   if( bUseAlphaTex == 1 ) {' +
        '       color.a = texture2D( tMatAlphaTex, vTexcoord ).r;' +
        '   }' +
        '   gl_FragColor = color;' +
        '}';


    //////////////////////////////////////////////////////////////////////////
    // @brief Get vertex shader code for lighting program.
    // @return Vertex shader code.
    public static GetVertexShaderCode(): string {
        return FLightingShaders.VertexShaderCode;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get pixel (fragment) shader code for lighting program.
    // @return Pixel shader code.
    public static GetPixelShaderCode(): string {
        return FLightingShaders.PixelShaderCode;
    };
};

export class CLightingProgram extends CProgram
{
    public constructor( gl: WebGLRenderingContext, name: string )
    {
        super( gl, name, FLightingShaders.GetVertexShaderCode(), FLightingShaders.GetPixelShaderCode() );

        this.QueryAttributeLocation( gl, "aPosition", EAttribute.Position );
        this.QueryAttributeLocation( gl, "aTexcoord", EAttribute.Texcoord );
        this.QueryAttributeLocation( gl, "aInstancePosition", EAttribute.InstancePosition );
        this.QueryAttributeLocation( gl, "aInstanceTexcoord", EAttribute.InstanceTexcoord );
        
        this.QueryTextureLocation( gl, "tMatDiffuseTex", ETexture.Color );
        this.QueryTextureLocation( gl, "tMatAlphaTex", ETexture.Alpha );

        this.QueryUniformLocation( gl, "bUseAlphaTex", EUniform.UseAlphaTexture );
        this.QueryUniformLocation( gl, "uInvFrameSize", EUniform.InvFrameSize );
    };
};

