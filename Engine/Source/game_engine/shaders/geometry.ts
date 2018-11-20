import { CProgram, EUniform, ETexture, EAttribute } from "../rendering/program";

abstract class FGeometryShaders
{
    static VertexShaderCode: string =
        'precision mediump float;' +
        'attribute vec3 aPosition;' +
        'attribute vec2 aTexcoord;' +
        'attribute vec3 aInstancePosition;' +
        'attribute vec2 aInstanceTexcoord;' +
        'varying vec2 vTexcoord;' +
        'varying float vDepth;' +
        'uniform vec2 uInvFrameSize;' +

        'void main( void ) {' +
        '   vec2 position = 2.0 * (aPosition.xy + aInstancePosition.xy) * uInvFrameSize - 1.0;' +
        '   float depth = aPosition.z + aInstancePosition.z;' +
        '   gl_Position = vec4( position, depth, 1.0 );' +
        '   vTexcoord = aTexcoord + aInstanceTexcoord;' +
        '   vDepth = depth;' +
        '}';

    static PixelShaderCode: string =
        'precision mediump float;' +
        'varying vec2 vTexcoord;' +
        'varying float vDepth;' +
        'uniform sampler2D uMatDiffuseTex;' +
        'uniform sampler2D uMatSpecularTex;' +
        'uniform sampler2D uMatNormalTex;' +
        'uniform sampler2D uMatAlphaTex;' +
        'uniform vec3 uMatDiffuseColor;' +
        'uniform float uMatSpecularValue;' +
        'uniform float uMatSpecularExponent;' +
        'uniform float uMatTransparency;' +
        'uniform int bUseDiffuseTex;' +
        'uniform int bUseSpecularTex;' +
        'uniform int bUseNormalTex;' +
        'uniform int bUseAlphaTex;' +
        'uniform int uPass;' +

        'vec4 getDepth( float depth ) {' +
        '   vec4 outDepth;' +
        '   outDepth.r = (depth) * 255.0;' +
        '   outDepth.g = (outDepth.r - floor(outDepth.r)) * 255.0;' +
        '   outDepth.b = (outDepth.g - floor(outDepth.g)) * 255.0;' +
        '   outDepth.a = 1.0;' +
        '   return outDepth / vec4( 255.0, 255.0, 255.0, 1.0 );' +
        '}' +

        'void main( void ) {' +
        '   vec4 outColor;' +
        //'   if( uPass == 0 ) {' +
        '       vec3 color = uMatDiffuseColor;' +
        '       if( bUseDiffuseTex == 1 ) {' +
        '           vec4 diffuse = texture2D( uMatDiffuseTex, vTexcoord );' +
        '           color = color * (1.0 - diffuse.a) + diffuse.rgb * diffuse.a;' +
        '       }' +
        '       float alpha = 1.0 - uMatTransparency;' +
        '       if( bUseAlphaTex == 1 ) {' +
        '           alpha = texture2D( uMatAlphaTex, vTexcoord ).r;' +
        '       }' +
        '       outColor = vec4( color, alpha );' +
        //'   }' +
        //'   else if( uPass == 1 ) {' +
        //'       outColor = getDepth( vDepth );' +
        //'   }' +
        //'   else if( uPass == 2 ) {' +
        //'       if( bUseSpecularTex == 1 ) {' +
        //'           outColor = vec4( texture2D( uMatSpecularTex, vTexcoord ).r, 0, 0, 1 );' +
        //'       } else {' +
        //'           outColor = vec4( uMatSpecularValue, 0, 0, 1 );' +
        //'       }' +
        //'   }' +
        '   gl_FragColor = outColor;' +
        '}';
};

export class CGeometryProgram extends CProgram
{
    public constructor( gl: WebGLRenderingContext, name: string )
    {
        super( gl, name, FGeometryShaders.VertexShaderCode, FGeometryShaders.PixelShaderCode );

        this.QueryAttributeLocation( gl, "aPosition", EAttribute.Position );
        this.QueryAttributeLocation( gl, "aTexcoord", EAttribute.Texcoord );
        this.QueryAttributeLocation( gl, "aInstancePosition", EAttribute.InstancePosition );
        this.QueryAttributeLocation( gl, "aInstanceTexcoord", EAttribute.InstanceTexcoord );

        this.QueryTextureLocation( gl, "uMatDiffuseTex", ETexture.MaterialDiffuse );
        this.QueryTextureLocation( gl, "uMatSpecularTex", ETexture.MaterialSpecular );
        this.QueryTextureLocation( gl, "uMatNormalTex", ETexture.MaterialNormal );
        this.QueryTextureLocation( gl, "uMatAlphaTex", ETexture.MaterialAlpha );

        this.QueryUniformLocation( gl, "uInvFrameSize", EUniform.InvFrameSize );
        this.QueryUniformLocation( gl, "uPass", EUniform.RenderingPass );

        this.QueryUniformLocation( gl, "uMatDiffuseColor", EUniform.MaterialDiffuseColor );
        this.QueryUniformLocation( gl, "uMatSpecularValue", EUniform.MaterialSpecularValue );
        this.QueryUniformLocation( gl, "uMatSpecularExponent", EUniform.MaterialSpecularExponent );
        this.QueryUniformLocation( gl, "uMatTransparency", EUniform.MaterialTransparency );
        this.QueryUniformLocation( gl, "bUseDiffuseTex", EUniform.UseDiffuseTexture );
        this.QueryUniformLocation( gl, "bUseSpecularTex", EUniform.UseSpecularTexture );
        this.QueryUniformLocation( gl, "bUseNormalTex", EUniform.UseNormalTexture );
        this.QueryUniformLocation( gl, "bUseAlphaTex", EUniform.UseAlphaTexture );
    }
}
