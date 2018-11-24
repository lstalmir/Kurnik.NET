import { CProgram, EUniform, ETexture, EAttribute } from "../../game_engine/rendering/program";
import { EBombermanUniform, EBombermanTexture } from "./shader_constants";

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
        'uniform vec2 uInvWorldSize;' +

        'void main( void ) {' +
        '   vec2 position = 2.0 * (aPosition.xy + aInstancePosition.xy) * uInvWorldSize - 1.0;' +
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
        'uniform int bPlayerPass;' +

        'void main( void ) {' +
        '   vec4 outColor;' +
        '   vec3 color = uMatDiffuseColor;' +
        '   if( bUseDiffuseTex == 1 ) {' +
        '       vec4 diffuse = texture2D( uMatDiffuseTex, vTexcoord );' +
        '       if( bPlayerPass == 0 ) {' +
        '           color = mix( color, diffuse.rgb, diffuse.a );' +
        '       } else {' +
        '           color = (1.0-diffuse.b) * (diffuse.g) * mix(color, vec3(0.95, 0.95, 0.95), 1.0-diffuse.r);' +
        '           gl_FragColor = vec4( color, diffuse.g );' +
        '           return;' +
        '       }' +
        '   }' +
        '   float alpha = 1.0 - uMatTransparency;' +
        '   if( bUseAlphaTex == 1 ) {' +
        '       alpha = texture2D( uMatAlphaTex, vTexcoord ).r;' +
        '   }' +
        '   outColor = vec4( color, alpha );' +
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
        this.QueryTextureLocation( gl, "uMatColorMaskTex", EBombermanTexture.MaterialColorMask );

        this.QueryUniformLocation( gl, "uInvFrameSize", EUniform.InvFrameSize );
        this.QueryUniformLocation( gl, "uInvWorldSize", EBombermanUniform.InvWorldSize );

        this.QueryUniformLocation( gl, "uMatDiffuseColor", EUniform.MaterialDiffuseColor );
        this.QueryUniformLocation( gl, "uMatSpecularValue", EUniform.MaterialSpecularValue );
        this.QueryUniformLocation( gl, "uMatSpecularExponent", EUniform.MaterialSpecularExponent );
        this.QueryUniformLocation( gl, "uMatTransparency", EUniform.MaterialTransparency );
        this.QueryUniformLocation( gl, "bUseDiffuseTex", EUniform.UseDiffuseTexture );
        this.QueryUniformLocation( gl, "bUseSpecularTex", EUniform.UseSpecularTexture );
        this.QueryUniformLocation( gl, "bUseNormalTex", EUniform.UseNormalTexture );
        this.QueryUniformLocation( gl, "bUseAlphaTex", EUniform.UseAlphaTexture );
        this.QueryUniformLocation( gl, "bPlayerPass", EBombermanUniform.PlayerPass );
    }
}
