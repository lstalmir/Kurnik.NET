
export abstract class FUserInterfaceShaders
{
    private static VertexShaderCode: string =
        'precision mediump float;' +
        'attribute vec3 aPosition;' +
        'attribute vec2 aTexcoord;' +
        'varying vec2 vTexcoord;' +
        'uniform vec2 uInvFrameSize;' +
        'void main( void ) {' +
        '   gl_Position = vec4( aPosition.xy, 0.0, 1.0 );' +
        '   vTexcoord = aTexcoord;' +
        '}';

    private static PixelShaderCode: string =
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


    //////////////////////////////////////////////////////////////////////////
    // @brief Get vertex shader code for user interface program.
    // @return Vertex shader code.
    public static GetVertexShaderCode(): string
    {
        return FUserInterfaceShaders.VertexShaderCode;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get pixel (fragment) shader code for user interface program.
    // @return Pixel shader code.
    public static GetPixelShaderCode(): string
    {
        return FUserInterfaceShaders.PixelShaderCode;
    };
};
