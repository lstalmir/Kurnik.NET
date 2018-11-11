import { CProgram, EAttribute, ETexture, EUniform } from "../rendering/program";

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
        'uniform sampler2D tFrameTex;' +
        'void main( void ) {' +
        '   vec4 color = texture2D( tFrameTex, vTexcoord );' +
        '   gl_FragColor = color;' +
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

        this.QueryUniformLocation( gl, "uInvFrameSize", EUniform.InvFrameSize );
    };
};
