import { CProgram, EAttribute, ETexture, EUniform } from "../../game_engine/rendering/program";
import { EBombermanUniform } from "./shader_constants";

abstract class FPostProcessShaders
{
    static VertexShaderCode: string =
        'precision mediump float;' +
        'attribute vec3 aPosition;' +
        'attribute vec2 aTexcoord;' +
        'attribute vec3 aInstancePosition;' +
        'attribute vec2 aInstanceTexcoord;' +
        'varying vec2 vTexcoord;' +
        'uniform vec2 uInvFrameSize;' +
        'void main( void ) {' +
        '   gl_Position = vec4( vec2( 1, -1 ) * aPosition.xy, 0.0, 1.0 );' +
        '   vTexcoord = aTexcoord;' +
        '}';

    static PixelShaderCode: string =
        'precision mediump float;' +
        'varying vec2 vTexcoord;' +
        'uniform sampler2D tColorTex;' +
        'uniform sampler2D tUITex;' +
        'uniform sampler2D tBackgroundTex;' +
        'uniform int uPass;' +
        'void main( void ) {' +
        '   if( uPass == 1 ) {' +
        '       gl_FragColor = texture2D( tColorTex, vTexcoord );' +
        '       return;' +
        '   }' +
        '   vec4 color = vec4( 1, 1, 1, 1 );' +
        '   vec4 ui = texture2D( tUITex, vTexcoord );' +
        '   vec4 bg = texture2D( tBackgroundTex, vTexcoord );' +
        '   gl_FragColor = vec4( mix( mix( color.rgb, ui.rgb, ui.a ), bg.rgb, bg.a ), 1.0 );' +
        '}';
};

export class CPostProcessProgram extends CProgram
{
    public constructor( gl: WebGLRenderingContext, name: string )
    {
        super( gl, name, FPostProcessShaders.VertexShaderCode, FPostProcessShaders.PixelShaderCode );

        this.QueryAttributeLocation( gl, "aPosition", EAttribute.Position );
        this.QueryAttributeLocation( gl, "aTexcoord", EAttribute.Texcoord );
        this.QueryAttributeLocation( gl, "aInstancePosition", EAttribute.InstancePosition );
        this.QueryAttributeLocation( gl, "aInstanceTexcoord", EAttribute.InstanceTexcoord );

        this.QueryTextureLocation( gl, "tFrameTex", ETexture.Color );
        this.QueryTextureLocation( gl, "tUITex", ETexture.Color + 1 );
        this.QueryTextureLocation( gl, "tBackgroundTex", ETexture.Color + 2 );

        this.QueryUniformLocation( gl, "uInvFrameSize", EUniform.InvFrameSize );
        this.QueryUniformLocation( gl, "uPass", EBombermanUniform.PostProcessPass );
    };
};
