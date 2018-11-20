import { EAttribute, ETexture, EUniform, CProgram } from "../../game_engine/rendering/program";

abstract class FUserInterfaceShaders
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
        '   gl_Position = vec4( aPosition.xy, 0.0, 1.0 );' +
        '   vTexcoord = aTexcoord;' +
        '}';

    static PixelShaderCode: string =
        'precision mediump float;' +
        'varying vec2 vTexcoord;' +
        'uniform sampler2D tColorTex;' +
        'uniform sampler2D tAlphaTex;' +
        'uniform int bUseAlphaTex;' +
        'void main( void ) {' +
        '   vec4 color = texture2D( tColorTex, vTexcoord );' +
        '   if( bUseAlphaTex == 1 ) {' +
        '       color.a = texture2D( tAlphaTex, vTexcoord ).r;' +
        '   }' +
        '   gl_FragColor = color;' +
        '}';
};

export class CUserInterfaceProgram extends CProgram
{
    public constructor( gl: WebGLRenderingContext, name: string )
    {
        super( gl, name, FUserInterfaceShaders.VertexShaderCode, FUserInterfaceShaders.PixelShaderCode );

        this.QueryAttributeLocation( gl, "aPosition", EAttribute.Position );
        this.QueryAttributeLocation( gl, "aTexcoord", EAttribute.Texcoord );
        this.QueryAttributeLocation( gl, "aInstancePosition", EAttribute.InstancePosition );
        this.QueryAttributeLocation( gl, "aInstanceTexcoord", EAttribute.InstanceTexcoord );

        this.QueryTextureLocation( gl, "tColorTex", ETexture.Color );
        this.QueryTextureLocation( gl, "tAlphaTex", ETexture.Alpha );

        this.QueryUniformLocation( gl, "bUseAlphaTex", EUniform.UseAlphaTexture );
        this.QueryUniformLocation( gl, "uInvFrameSize", EUniform.InvFrameSize );
    }
};
