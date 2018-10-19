export const GDebug: boolean = true;

export class CDebug
{
    public Log( message: string ): void
    {
        if ( GDebug )
        {
            console.log( new Date().toISOString() + ': ' + message );
        }
    };
};

export class CDebugWebGLRenderingContext implements WebGLRenderingContext
{
    readonly canvas: HTMLCanvasElement;
    readonly drawingBufferHeight
    readonly drawingBufferWidth

    private mGL: WebGLRenderingContext;
    private mDebug: CDebug;

    private mDrawCallNumber: number;


    public constructor( gl: WebGLRenderingContext )
    {
        this.mGL = gl;
        this.mDebug = new CDebug();
        this.canvas = gl.canvas;
        this.drawingBufferHeight = gl.drawingBufferHeight;
        this.drawingBufferWidth = gl.drawingBufferWidth;
        this.mDrawCallNumber = 0;

        this.ACTIVE_ATTRIBUTES = this.mGL.ACTIVE_ATTRIBUTES;
        this.ACTIVE_TEXTURE = this.mGL.ACTIVE_TEXTURE;
        this.ACTIVE_UNIFORMS = this.mGL.ACTIVE_UNIFORMS;
        this.ALIASED_LINE_WIDTH_RANGE = this.mGL.ALIASED_LINE_WIDTH_RANGE;
        this.ALIASED_POINT_SIZE_RANGE = this.mGL.ALIASED_POINT_SIZE_RANGE;
        this.ALPHA = this.mGL.ALPHA;
        this.ALPHA_BITS = this.mGL.ALPHA_BITS;
        this.ALWAYS = this.mGL.ALWAYS;
        this.ARRAY_BUFFER = this.mGL.ARRAY_BUFFER;
        this.ARRAY_BUFFER_BINDING = this.mGL.ARRAY_BUFFER_BINDING;
        this.ATTACHED_SHADERS = this.mGL.ATTACHED_SHADERS;
        this.BACK = this.mGL.BACK;
        this.BLEND = this.mGL.BLEND;
        this.BLEND_COLOR = this.mGL.BLEND_COLOR;
        this.BLEND_DST_ALPHA = this.mGL.BLEND_DST_ALPHA;
        this.BLEND_DST_RGB = this.mGL.BLEND_DST_RGB;
        this.BLEND_EQUATION = this.mGL.BLEND_EQUATION;
        this.BLEND_EQUATION_ALPHA = this.mGL.BLEND_EQUATION_ALPHA;
        this.BLEND_EQUATION_RGB = this.mGL.BLEND_EQUATION_RGB;
        this.BLEND_SRC_ALPHA = this.mGL.BLEND_SRC_ALPHA;
        this.BLEND_SRC_RGB = this.mGL.BLEND_SRC_RGB;
        this.BLUE_BITS = this.mGL.BLUE_BITS;
        this.BOOL = this.mGL.BOOL;
        this.BOOL_VEC2 = this.mGL.BOOL_VEC2;
        this.BOOL_VEC3 = this.mGL.BOOL_VEC3;
        this.BOOL_VEC4 = this.mGL.BOOL_VEC4;
        this.BROWSER_DEFAULT_WEBGL = this.mGL.BROWSER_DEFAULT_WEBGL;
        this.BUFFER_SIZE = this.mGL.BUFFER_SIZE;
        this.BUFFER_USAGE = this.mGL.BUFFER_USAGE;
        this.BYTE = this.mGL.BYTE;
        this.CCW = this.mGL.CCW;
        this.CLAMP_TO_EDGE = this.mGL.CLAMP_TO_EDGE;
        this.COLOR_ATTACHMENT0 = this.mGL.COLOR_ATTACHMENT0;
        this.COLOR_BUFFER_BIT = this.mGL.COLOR_BUFFER_BIT;
        this.COLOR_CLEAR_VALUE = this.mGL.COLOR_CLEAR_VALUE;
        this.COLOR_WRITEMASK = this.mGL.COLOR_WRITEMASK;
        this.COMPILE_STATUS = this.mGL.COMPILE_STATUS;
        this.COMPRESSED_TEXTURE_FORMATS = this.mGL.COMPRESSED_TEXTURE_FORMATS;
        this.CONSTANT_ALPHA = this.mGL.CONSTANT_ALPHA;
        this.CONSTANT_COLOR = this.mGL.CONSTANT_COLOR;
        this.CONTEXT_LOST_WEBGL = this.mGL.CONTEXT_LOST_WEBGL;
        this.CULL_FACE = this.mGL.CULL_FACE;
        this.CULL_FACE_MODE = this.mGL.CULL_FACE_MODE;
        this.CURRENT_PROGRAM = this.mGL.CURRENT_PROGRAM;
        this.CURRENT_VERTEX_ATTRIB = this.mGL.CURRENT_VERTEX_ATTRIB;
        this.CW = this.mGL.CW;
        this.DECR = this.mGL.DECR;
        this.DECR_WRAP = this.mGL.DECR_WRAP;
        this.DELETE_STATUS = this.mGL.DELETE_STATUS;
        this.DEPTH_ATTACHMENT = this.mGL.DEPTH_ATTACHMENT;
        this.DEPTH_BITS = this.mGL.DEPTH_BITS;
        this.DEPTH_BUFFER_BIT = this.mGL.DEPTH_BUFFER_BIT;
        this.DEPTH_CLEAR_VALUE = this.mGL.DEPTH_CLEAR_VALUE;
        this.DEPTH_COMPONENT = this.mGL.DEPTH_COMPONENT;
        this.DEPTH_COMPONENT16 = this.mGL.DEPTH_COMPONENT16;
        this.DEPTH_FUNC = this.mGL.DEPTH_FUNC;
        this.DEPTH_RANGE = this.mGL.DEPTH_RANGE;
        this.DEPTH_STENCIL = this.mGL.DEPTH_STENCIL;
        this.DEPTH_STENCIL_ATTACHMENT = this.mGL.DEPTH_STENCIL_ATTACHMENT;
        this.DEPTH_TEST = this.mGL.DEPTH_TEST;
        this.DEPTH_WRITEMASK = this.mGL.DEPTH_WRITEMASK;
        this.DITHER = this.mGL.DITHER;
        this.DONT_CARE = this.mGL.DONT_CARE;
        this.DST_ALPHA = this.mGL.DST_ALPHA;
        this.DST_COLOR = this.mGL.DST_COLOR;
        this.DYNAMIC_DRAW = this.mGL.DYNAMIC_DRAW;
        this.ELEMENT_ARRAY_BUFFER = this.mGL.ELEMENT_ARRAY_BUFFER;
        this.ELEMENT_ARRAY_BUFFER_BINDING = this.mGL.ELEMENT_ARRAY_BUFFER_BINDING;
        this.EQUAL = this.mGL.EQUAL;
        this.FASTEST = this.mGL.FASTEST;
        this.FLOAT = this.mGL.FLOAT;
        this.FLOAT_MAT2 = this.mGL.FLOAT_MAT2;
        this.FLOAT_MAT3 = this.mGL.FLOAT_MAT3;
        this.FLOAT_MAT4 = this.mGL.FLOAT_MAT4;
        this.FLOAT_VEC2 = this.mGL.FLOAT_VEC2;
        this.FLOAT_VEC3 = this.mGL.FLOAT_VEC3;
        this.FLOAT_VEC4 = this.mGL.FLOAT_VEC4;
        this.FRAGMENT_SHADER = this.mGL.FRAGMENT_SHADER;
        this.FRAMEBUFFER = this.mGL.FRAMEBUFFER;
        this.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = this.mGL.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME;
        this.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = this.mGL.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE;
        this.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = this.mGL.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE;
        this.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = this.mGL.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL;
        this.FRAMEBUFFER_BINDING = this.mGL.FRAMEBUFFER_BINDING;
        this.FRAMEBUFFER_COMPLETE = this.mGL.FRAMEBUFFER_COMPLETE;
        this.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = this.mGL.FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
        this.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = this.mGL.FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
        this.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = this.mGL.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
        this.FRAMEBUFFER_UNSUPPORTED = this.mGL.FRAMEBUFFER_UNSUPPORTED;
        this.FRONT = this.mGL.FRONT;
        this.FRONT_AND_BACK = this.mGL.FRONT_AND_BACK;
        this.FRONT_FACE = this.mGL.FRONT_FACE;
        this.FUNC_ADD = this.mGL.FUNC_ADD;
        this.FUNC_REVERSE_SUBTRACT = this.mGL.FUNC_REVERSE_SUBTRACT;
        this.FUNC_SUBTRACT = this.mGL.FUNC_SUBTRACT;
        this.GENERATE_MIPMAP_HINT = this.mGL.GENERATE_MIPMAP_HINT;
        this.GEQUAL = this.mGL.GEQUAL;
        this.GREATER = this.mGL.GREATER;
        this.GREEN_BITS = this.mGL.GREEN_BITS;
        this.HIGH_FLOAT = this.mGL.HIGH_FLOAT;
        this.HIGH_INT = this.mGL.HIGH_INT;
        this.IMPLEMENTATION_COLOR_READ_FORMAT = this.mGL.IMPLEMENTATION_COLOR_READ_FORMAT;
        this.IMPLEMENTATION_COLOR_READ_TYPE = this.mGL.IMPLEMENTATION_COLOR_READ_TYPE;
        this.INCR = this.mGL.INCR;
        this.INCR_WRAP = this.mGL.INCR_WRAP;
        this.INT = this.mGL.INT;
        this.INT_VEC2 = this.mGL.INT_VEC2;
        this.INT_VEC3 = this.mGL.INT_VEC3;
        this.INT_VEC4 = this.mGL.INT_VEC4;
        this.INVALID_ENUM = this.mGL.INVALID_ENUM;
        this.INVALID_FRAMEBUFFER_OPERATION = this.mGL.INVALID_FRAMEBUFFER_OPERATION;
        this.INVALID_OPERATION = this.mGL.INVALID_OPERATION;
        this.INVALID_VALUE = this.mGL.INVALID_VALUE;
        this.INVERT = this.mGL.INVERT;
        this.KEEP = this.mGL.KEEP;
        this.LEQUAL = this.mGL.LEQUAL;
        this.LESS = this.mGL.LESS;
        this.LINEAR = this.mGL.LINEAR;
        this.LINEAR_MIPMAP_LINEAR = this.mGL.LINEAR_MIPMAP_LINEAR;
        this.LINEAR_MIPMAP_NEAREST = this.mGL.LINEAR_MIPMAP_NEAREST;
        this.LINES = this.mGL.LINES;
        this.LINE_LOOP = this.mGL.LINE_LOOP;
        this.LINE_STRIP = this.mGL.LINE_STRIP;
        this.LINE_WIDTH = this.mGL.LINE_WIDTH;
        this.LINK_STATUS = this.mGL.LINK_STATUS;
        this.LOW_FLOAT = this.mGL.LOW_FLOAT;
        this.LOW_INT = this.mGL.LOW_INT;
        this.LUMINANCE = this.mGL.LUMINANCE;
        this.LUMINANCE_ALPHA = this.mGL.LUMINANCE_ALPHA;
        this.MAX_COMBINED_TEXTURE_IMAGE_UNITS = this.mGL.MAX_COMBINED_TEXTURE_IMAGE_UNITS;
        this.MAX_CUBE_MAP_TEXTURE_SIZE = this.mGL.MAX_CUBE_MAP_TEXTURE_SIZE;
        this.MAX_FRAGMENT_UNIFORM_VECTORS = this.mGL.MAX_FRAGMENT_UNIFORM_VECTORS;
        this.MAX_RENDERBUFFER_SIZE = this.mGL.MAX_RENDERBUFFER_SIZE;
        this.MAX_TEXTURE_IMAGE_UNITS = this.mGL.MAX_TEXTURE_IMAGE_UNITS;
        this.MAX_TEXTURE_SIZE = this.mGL.MAX_TEXTURE_SIZE;
        this.MAX_VARYING_VECTORS = this.mGL.MAX_VARYING_VECTORS;
        this.MAX_VERTEX_ATTRIBS = this.mGL.MAX_VERTEX_ATTRIBS;
        this.MAX_VERTEX_TEXTURE_IMAGE_UNITS = this.mGL.MAX_VERTEX_TEXTURE_IMAGE_UNITS;
        this.MAX_VERTEX_UNIFORM_VECTORS = this.mGL.MAX_VERTEX_UNIFORM_VECTORS;
        this.MAX_VIEWPORT_DIMS = this.mGL.MAX_VIEWPORT_DIMS;
        this.MEDIUM_FLOAT = this.mGL.MEDIUM_FLOAT;
        this.MEDIUM_INT = this.mGL.MEDIUM_INT;
        this.MIRRORED_REPEAT = this.mGL.MIRRORED_REPEAT;
        this.NEAREST = this.mGL.NEAREST;
        this.NEAREST_MIPMAP_LINEAR = this.mGL.NEAREST_MIPMAP_LINEAR;
        this.NEAREST_MIPMAP_NEAREST = this.mGL.NEAREST_MIPMAP_NEAREST;
        this.NEVER = this.mGL.NEVER;
        this.NICEST = this.mGL.NICEST;
        this.NONE = this.mGL.NONE;
        this.NOTEQUAL = this.mGL.NOTEQUAL;
        this.NO_ERROR = this.mGL.NO_ERROR;
        this.ONE = this.mGL.ONE;
        this.ONE_MINUS_CONSTANT_ALPHA = this.mGL.ONE_MINUS_CONSTANT_ALPHA;
        this.ONE_MINUS_CONSTANT_COLOR = this.mGL.ONE_MINUS_CONSTANT_COLOR;
        this.ONE_MINUS_DST_ALPHA = this.mGL.ONE_MINUS_DST_ALPHA;
        this.ONE_MINUS_DST_COLOR = this.mGL.ONE_MINUS_DST_COLOR;
        this.ONE_MINUS_SRC_ALPHA = this.mGL.ONE_MINUS_SRC_ALPHA;
        this.ONE_MINUS_SRC_COLOR = this.mGL.ONE_MINUS_SRC_COLOR;
        this.OUT_OF_MEMORY = this.mGL.OUT_OF_MEMORY;
        this.PACK_ALIGNMENT = this.mGL.PACK_ALIGNMENT;
        this.POINTS = this.mGL.POINTS;
        this.POLYGON_OFFSET_FACTOR = this.mGL.POLYGON_OFFSET_FACTOR;
        this.POLYGON_OFFSET_FILL = this.mGL.POLYGON_OFFSET_FILL;
        this.POLYGON_OFFSET_UNITS = this.mGL.POLYGON_OFFSET_UNITS;
        this.RED_BITS = this.mGL.RED_BITS;
        this.RENDERBUFFER = this.mGL.RENDERBUFFER;
        this.RENDERBUFFER_ALPHA_SIZE = this.mGL.RENDERBUFFER_ALPHA_SIZE;
        this.RENDERBUFFER_BINDING = this.mGL.RENDERBUFFER_BINDING;
        this.RENDERBUFFER_BLUE_SIZE = this.mGL.RENDERBUFFER_BLUE_SIZE;
        this.RENDERBUFFER_DEPTH_SIZE = this.mGL.RENDERBUFFER_DEPTH_SIZE;
        this.RENDERBUFFER_GREEN_SIZE = this.mGL.RENDERBUFFER_GREEN_SIZE;
        this.RENDERBUFFER_HEIGHT = this.mGL.RENDERBUFFER_HEIGHT;
        this.RENDERBUFFER_INTERNAL_FORMAT = this.mGL.RENDERBUFFER_INTERNAL_FORMAT;
        this.RENDERBUFFER_RED_SIZE = this.mGL.RENDERBUFFER_RED_SIZE;
        this.RENDERBUFFER_STENCIL_SIZE = this.mGL.RENDERBUFFER_STENCIL_SIZE;
        this.RENDERBUFFER_WIDTH = this.mGL.RENDERBUFFER_WIDTH;
        this.RENDERER = this.mGL.RENDERER;
        this.REPEAT = this.mGL.REPEAT;
        this.REPLACE = this.mGL.REPLACE;
        this.RGB = this.mGL.RGB;
        this.RGB565 = this.mGL.RGB565;
        this.RGB5_A1 = this.mGL.RGB5_A1;
        this.RGBA = this.mGL.RGBA;
        this.RGBA4 = this.mGL.RGBA4;
        this.SAMPLER_2D = this.mGL.SAMPLER_2D;
        this.SAMPLER_CUBE = this.mGL.SAMPLER_CUBE;
        this.SAMPLES = this.mGL.SAMPLES;
        this.SAMPLE_ALPHA_TO_COVERAGE = this.mGL.SAMPLE_ALPHA_TO_COVERAGE;
        this.SAMPLE_BUFFERS = this.mGL.SAMPLE_BUFFERS;
        this.SAMPLE_COVERAGE = this.mGL.SAMPLE_COVERAGE;
        this.SAMPLE_COVERAGE_INVERT = this.mGL.SAMPLE_COVERAGE_INVERT;
        this.SAMPLE_COVERAGE_VALUE = this.mGL.SAMPLE_COVERAGE_VALUE;
        this.SCISSOR_BOX = this.mGL.SCISSOR_BOX;
        this.SCISSOR_TEST = this.mGL.SCISSOR_TEST;
        this.SHADER_TYPE = this.mGL.SHADER_TYPE;
        this.SHADING_LANGUAGE_VERSION = this.mGL.SHADING_LANGUAGE_VERSION;
        this.SHORT = this.mGL.SHORT;
        this.SRC_ALPHA = this.mGL.SRC_ALPHA;
        this.SRC_ALPHA_SATURATE = this.mGL.SRC_ALPHA_SATURATE;
        this.SRC_COLOR = this.mGL.SRC_COLOR;
        this.STATIC_DRAW = this.mGL.STATIC_DRAW;
        this.STENCIL_ATTACHMENT = this.mGL.STENCIL_ATTACHMENT;
        this.STENCIL_BACK_FAIL = this.mGL.STENCIL_BACK_FAIL;
        this.STENCIL_BACK_FUNC = this.mGL.STENCIL_BACK_FUNC;
        this.STENCIL_BACK_PASS_DEPTH_FAIL = this.mGL.STENCIL_BACK_PASS_DEPTH_FAIL;
        this.STENCIL_BACK_PASS_DEPTH_PASS = this.mGL.STENCIL_BACK_PASS_DEPTH_PASS;
        this.STENCIL_BACK_REF = this.mGL.STENCIL_BACK_REF;
        this.STENCIL_BACK_VALUE_MASK = this.mGL.STENCIL_BACK_VALUE_MASK;
        this.STENCIL_BACK_WRITEMASK = this.mGL.STENCIL_BACK_WRITEMASK;
        this.STENCIL_BITS = this.mGL.STENCIL_BITS;
        this.STENCIL_BUFFER_BIT = this.mGL.STENCIL_BUFFER_BIT;
        this.STENCIL_CLEAR_VALUE = this.mGL.STENCIL_CLEAR_VALUE;
        this.STENCIL_FAIL = this.mGL.STENCIL_FAIL;
        this.STENCIL_FUNC = this.mGL.STENCIL_FUNC;
        //this.STENCIL_INDEX = this.mGL.STENCIL_INDEX;
        this.STENCIL_INDEX8 = this.mGL.STENCIL_INDEX8;
        this.STENCIL_PASS_DEPTH_FAIL = this.mGL.STENCIL_PASS_DEPTH_FAIL;
        this.STENCIL_PASS_DEPTH_PASS = this.mGL.STENCIL_PASS_DEPTH_PASS;
        this.STENCIL_REF = this.mGL.STENCIL_REF;
        this.STENCIL_TEST = this.mGL.STENCIL_TEST;
        this.STENCIL_VALUE_MASK = this.mGL.STENCIL_VALUE_MASK;
        this.STENCIL_WRITEMASK = this.mGL.STENCIL_WRITEMASK;
        this.STREAM_DRAW = this.mGL.STREAM_DRAW;
        this.SUBPIXEL_BITS = this.mGL.SUBPIXEL_BITS;
        this.TEXTURE = this.mGL.TEXTURE;
        this.TEXTURE0 = this.mGL.TEXTURE0;
        this.TEXTURE1 = this.mGL.TEXTURE1;
        this.TEXTURE10 = this.mGL.TEXTURE10;
        this.TEXTURE11 = this.mGL.TEXTURE11;
        this.TEXTURE12 = this.mGL.TEXTURE12;
        this.TEXTURE13 = this.mGL.TEXTURE13;
        this.TEXTURE14 = this.mGL.TEXTURE14;
        this.TEXTURE15 = this.mGL.TEXTURE15;
        this.TEXTURE16 = this.mGL.TEXTURE16;
        this.TEXTURE17 = this.mGL.TEXTURE17;
        this.TEXTURE18 = this.mGL.TEXTURE18;
        this.TEXTURE19 = this.mGL.TEXTURE19;
        this.TEXTURE2 = this.mGL.TEXTURE2;
        this.TEXTURE20 = this.mGL.TEXTURE20;
        this.TEXTURE21 = this.mGL.TEXTURE21;
        this.TEXTURE22 = this.mGL.TEXTURE22;
        this.TEXTURE23 = this.mGL.TEXTURE23;
        this.TEXTURE24 = this.mGL.TEXTURE24;
        this.TEXTURE25 = this.mGL.TEXTURE25;
        this.TEXTURE26 = this.mGL.TEXTURE26;
        this.TEXTURE27 = this.mGL.TEXTURE27;
        this.TEXTURE28 = this.mGL.TEXTURE28;
        this.TEXTURE29 = this.mGL.TEXTURE29;
        this.TEXTURE3 = this.mGL.TEXTURE3;
        this.TEXTURE30 = this.mGL.TEXTURE30;
        this.TEXTURE31 = this.mGL.TEXTURE31;
        this.TEXTURE4 = this.mGL.TEXTURE4;
        this.TEXTURE5 = this.mGL.TEXTURE5;
        this.TEXTURE6 = this.mGL.TEXTURE6;
        this.TEXTURE7 = this.mGL.TEXTURE7;
        this.TEXTURE8 = this.mGL.TEXTURE8;
        this.TEXTURE9 = this.mGL.TEXTURE9;
        this.TEXTURE_2D = this.mGL.TEXTURE_2D;
        this.TEXTURE_BINDING_2D = this.mGL.TEXTURE_BINDING_2D;
        this.TEXTURE_BINDING_CUBE_MAP = this.mGL.TEXTURE_BINDING_CUBE_MAP;
        this.TEXTURE_CUBE_MAP = this.mGL.TEXTURE_CUBE_MAP;
        this.TEXTURE_CUBE_MAP_NEGATIVE_X = this.mGL.TEXTURE_CUBE_MAP_NEGATIVE_X;
        this.TEXTURE_CUBE_MAP_NEGATIVE_Y = this.mGL.TEXTURE_CUBE_MAP_NEGATIVE_Y;
        this.TEXTURE_CUBE_MAP_NEGATIVE_Z = this.mGL.TEXTURE_CUBE_MAP_NEGATIVE_Z;
        this.TEXTURE_CUBE_MAP_POSITIVE_X = this.mGL.TEXTURE_CUBE_MAP_POSITIVE_X;
        this.TEXTURE_CUBE_MAP_POSITIVE_Y = this.mGL.TEXTURE_CUBE_MAP_POSITIVE_Y;
        this.TEXTURE_CUBE_MAP_POSITIVE_Z = this.mGL.TEXTURE_CUBE_MAP_POSITIVE_Z;
        this.TEXTURE_MAG_FILTER = this.mGL.TEXTURE_MAG_FILTER;
        this.TEXTURE_MIN_FILTER = this.mGL.TEXTURE_MIN_FILTER;
        this.TEXTURE_WRAP_S = this.mGL.TEXTURE_WRAP_S;
        this.TEXTURE_WRAP_T = this.mGL.TEXTURE_WRAP_T;
        this.TRIANGLES = this.mGL.TRIANGLES;
        this.TRIANGLE_FAN = this.mGL.TRIANGLE_FAN;
        this.TRIANGLE_STRIP = this.mGL.TRIANGLE_STRIP;
        this.UNPACK_ALIGNMENT = this.mGL.UNPACK_ALIGNMENT;
        this.UNPACK_COLORSPACE_CONVERSION_WEBGL = this.mGL.UNPACK_COLORSPACE_CONVERSION_WEBGL;
        this.UNPACK_FLIP_Y_WEBGL = this.mGL.UNPACK_FLIP_Y_WEBGL;
        this.UNPACK_PREMULTIPLY_ALPHA_WEBGL = this.mGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL;
        this.UNSIGNED_BYTE = this.mGL.UNSIGNED_BYTE;
        this.UNSIGNED_INT = this.mGL.UNSIGNED_INT;
        this.UNSIGNED_SHORT = this.mGL.UNSIGNED_SHORT;
        this.UNSIGNED_SHORT_4_4_4_4 = this.mGL.UNSIGNED_SHORT_4_4_4_4;
        this.UNSIGNED_SHORT_5_5_5_1 = this.mGL.UNSIGNED_SHORT_5_5_5_1;
        this.UNSIGNED_SHORT_5_6_5 = this.mGL.UNSIGNED_SHORT_5_6_5;
        this.VALIDATE_STATUS = this.mGL.VALIDATE_STATUS;
        this.VENDOR = this.mGL.VENDOR;
        this.VERSION = this.mGL.VERSION;
        this.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = this.mGL.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING;
        this.VERTEX_ATTRIB_ARRAY_ENABLED = this.mGL.VERTEX_ATTRIB_ARRAY_ENABLED;
        this.VERTEX_ATTRIB_ARRAY_NORMALIZED = this.mGL.VERTEX_ATTRIB_ARRAY_NORMALIZED;
        this.VERTEX_ATTRIB_ARRAY_POINTER = this.mGL.VERTEX_ATTRIB_ARRAY_POINTER;
        this.VERTEX_ATTRIB_ARRAY_SIZE = this.mGL.VERTEX_ATTRIB_ARRAY_SIZE;
        this.VERTEX_ATTRIB_ARRAY_STRIDE = this.mGL.VERTEX_ATTRIB_ARRAY_STRIDE;
        this.VERTEX_ATTRIB_ARRAY_TYPE = this.mGL.VERTEX_ATTRIB_ARRAY_TYPE;
        this.VERTEX_SHADER = this.mGL.VERTEX_SHADER;
        this.VIEWPORT = this.mGL.VIEWPORT;
        this.ZERO = this.mGL.ZERO;
    };

    private LogFunctionCall( fn: string, ...args: any[] ): void
    {
        if ( GDebug )
        {
            var fnWithArgs = fn + '(';
            if ( args.length > 0 )
            {
                fnWithArgs += ' ';
                for ( var i = 0; i < args.length; ++i )
                {
                    fnWithArgs += args[i];
                    if ( i != args.length - 1 ) fnWithArgs += ', ';
                }
                fnWithArgs += ' ';
            }
            fnWithArgs += ')';
            this.mDebug.Log( fnWithArgs );
        }
    };

    private LogReturningFunctionCall( fn: string, result: any, ...args: any[] ): void
    {
        if ( GDebug )
        {
            var fnWithArgs = fn + '(';
            if ( args.length > 0 )
            {
                fnWithArgs += ' ';
                for ( var i = 0; i < args.length; ++i )
                {
                    fnWithArgs += args[i];
                    if ( i != args.length - 1 ) fnWithArgs += ', ';
                }
                fnWithArgs += ' ';
            }
            fnWithArgs += ')';
            if ( result !== undefined )
            {
                fnWithArgs += ' -> ' + result;
            }
            this.mDebug.Log( fnWithArgs );
        }
    };

    private LogDrawFunctionCall( fn: string, ...args: any[] ): void
    {
        if ( GDebug )
        {
            var fnWithArgs = fn + '(';
            if ( args.length > 0 )
            {
                fnWithArgs += ' ';
                for ( var i = 0; i < args.length; ++i )
                {
                    fnWithArgs += args[i];
                    if ( i != args.length - 1 ) fnWithArgs += ', ';
                }
                fnWithArgs += ' ';
            }
            fnWithArgs += ') [DC=' + this.mDrawCallNumber + ']';
            this.mDebug.Log( fnWithArgs );
            this.mDrawCallNumber += 1;
        }
    };

    public ResetDrawCallNumber(): void
    {
        this.mDrawCallNumber = 0;
    };

    private GetOpenGLConstName( target: number ): string
    {
        switch ( target )
        {
            case this.mGL.ACTIVE_ATTRIBUTES: return 'GL_ACTIVE_ATTRIBUTES';
            case this.mGL.ACTIVE_TEXTURE: return 'GL_ACTIVE_TEXTURE';
            case this.mGL.ACTIVE_UNIFORMS: return 'GL_ACTIVE_UNIFORMS';
            case this.mGL.ALIASED_LINE_WIDTH_RANGE: return 'GL_ALIASED_LINE_WIDTH_RANGE';
            case this.mGL.ALIASED_POINT_SIZE_RANGE: return 'GL_ALIASED_POINT_SIZE_RANGE';
            case this.mGL.ALPHA: return 'GL_ALPHA';
            case this.mGL.ALPHA_BITS: return 'GL_ALPHA_BITS';
            case this.mGL.ALWAYS: return 'GL_ALWAYS';
            case this.mGL.ARRAY_BUFFER: return 'GL_ARRAY_BUFFER';
            case this.mGL.ARRAY_BUFFER_BINDING: return 'GL_ARRAY_BUFFER_BINDING';
            case this.mGL.ATTACHED_SHADERS: return 'GL_ATTACHED_SHADERS';
            case this.mGL.BACK: return 'GL_BACK';
            case this.mGL.BLEND: return 'GL_BLEND';
            case this.mGL.BLEND_COLOR: return 'GL_BLEND_COLOR';
            case this.mGL.BLEND_DST_ALPHA: return 'GL_BLEND_DST_ALPHA';
            case this.mGL.BLEND_DST_RGB: return 'GL_BLEND_DST_RGB';
            case this.mGL.BLEND_EQUATION: return 'GL_BLEND_EQUATION';
            case this.mGL.BLEND_EQUATION_ALPHA: return 'GL_BLEND_EQUATION_ALPHA';
            case this.mGL.BLEND_EQUATION_RGB: return 'GL_BLEND_EQUATION_RGB';
            case this.mGL.BLEND_SRC_ALPHA: return 'GL_BLEND_SRC_ALPHA';
            case this.mGL.BLEND_SRC_RGB: return 'GL_BLEND_SRC_RGB';
            case this.mGL.BLUE_BITS: return 'GL_BLUE_BITS';
            case this.mGL.BOOL: return 'GL_BOOL';
            case this.mGL.BOOL_VEC2: return 'GL_BOOL_VEC2';
            case this.mGL.BOOL_VEC3: return 'GL_BOOL_VEC3';
            case this.mGL.BOOL_VEC4: return 'GL_BOOL_VEC4';
            case this.mGL.BROWSER_DEFAULT_WEBGL: return 'BROWSER_DEFAULT_WEBGL';
            case this.mGL.BUFFER_SIZE: return 'GL_BUFFER_SIZE';
            case this.mGL.BUFFER_USAGE: return 'GL_BUFFER_USAGE';
            case this.mGL.BYTE: return 'GL_BYTE';
            case this.mGL.CCW: return 'GL_CCW';
            case this.mGL.CLAMP_TO_EDGE: return 'GL_CLAMP_TO_EDGE';
            case this.mGL.COLOR_ATTACHMENT0: return 'GL_COLOR_ATTACHMENT0';
            case this.mGL.COLOR_BUFFER_BIT: return 'GL_COLOR_BUFFER_BIT';
            case this.mGL.COLOR_CLEAR_VALUE: return 'GL_COLOR_CLEAR_VALUE';
            case this.mGL.COLOR_WRITEMASK: return 'GL_COLOR_WRITEMASK';
            case this.mGL.COMPILE_STATUS: return 'GL_COMPILE_STATUS';
            case this.mGL.COMPRESSED_TEXTURE_FORMATS: return 'GL_COMPRESSED_TEXTURE_FORMATS';
            case this.mGL.CONSTANT_ALPHA: return 'GL_CONSTANT_ALPHA';
            case this.mGL.CONSTANT_COLOR: return 'GL_CONSTANT_COLOR';
            case this.mGL.CONTEXT_LOST_WEBGL: return 'GL_CONTEXT_LOST_WEBGL';
            case this.mGL.CULL_FACE: return 'GL_CULL_FACE';
            case this.mGL.CULL_FACE_MODE: return 'GL_CULL_FACE_MODE';
            case this.mGL.CURRENT_PROGRAM: return 'GL_CURRENT_PROGRAM';
            case this.mGL.CURRENT_VERTEX_ATTRIB: return 'GL_CURRENT_VERTEX_ATTRIB';
            case this.mGL.CW: return 'GL_CW';
            case this.mGL.DECR: return 'GL_DECR';
            case this.mGL.DECR_WRAP: return 'GL_DECR_WRAP';
            case this.mGL.DELETE_STATUS: return 'GL_DELETE_STATUS';
            case this.mGL.DEPTH_ATTACHMENT: return 'GL_DEPTH_ATTACHMENT';
            case this.mGL.DEPTH_BITS: return 'GL_DEPTH_BITS';
            case this.mGL.DEPTH_BUFFER_BIT: return 'GL_DEPTH_BUFFER_BIT';
            case this.mGL.DEPTH_CLEAR_VALUE: return 'GL_DEPTH_CLEAR_VALUE';
            case this.mGL.DEPTH_COMPONENT: return 'GL_DEPTH_COMPONENT';
            case this.mGL.DEPTH_COMPONENT16: return 'GL_DEPTH_COMPONENT16';
            case this.mGL.DEPTH_FUNC: return 'GL_DEPTH_FUNC';
            case this.mGL.DEPTH_RANGE: return 'GL_DEPTH_RANGE';
            case this.mGL.DEPTH_STENCIL: return 'GL_DEPTH_STENCIL';
            case this.mGL.DEPTH_STENCIL_ATTACHMENT: return 'GL_DEPTH_STENCIL_ATTACHMENT';
            case this.mGL.DEPTH_TEST: return 'GL_DEPTH_TEST';
            case this.mGL.DEPTH_WRITEMASK: return 'GL_DEPTH_WRITEMASK';
            case this.mGL.DITHER: return 'GL_DITHER';
            case this.mGL.DONT_CARE: return 'GL_DONT_CARE';
            case this.mGL.DST_ALPHA: return 'GL_DST_ALPHA';
            case this.mGL.DST_COLOR: return 'GL_DST_COLOR';
            case this.mGL.DYNAMIC_DRAW: return 'GL_DYNAMIC_DRAW';
            case this.mGL.ELEMENT_ARRAY_BUFFER: return 'GL_ELEMENT_ARRAY_BUFFER';
            case this.mGL.ELEMENT_ARRAY_BUFFER_BINDING: return 'GL_ELEMENT_ARRAY_BUFFER_BINDING';
            case this.mGL.EQUAL: return 'GL_EQUAL';
            case this.mGL.FASTEST: return 'GL_FASTEST';
            case this.mGL.FLOAT: return 'GL_FLOAT';
            case this.mGL.FLOAT_MAT2: return 'GL_FLOAT_MAT2';
            case this.mGL.FLOAT_MAT3: return 'GL_FLOAT_MAT3';
            case this.mGL.FLOAT_MAT4: return 'GL_FLOAT_MAT4';
            case this.mGL.FLOAT_VEC2: return 'GL_FLOAT_VEC2';
            case this.mGL.FLOAT_VEC3: return 'GL_FLOAT_VEC3';
            case this.mGL.FLOAT_VEC4: return 'GL_FLOAT_VEC4';
            case this.mGL.FRAGMENT_SHADER: return 'GL_FRAGMENT_SHADER';
            case this.mGL.FRAMEBUFFER: return 'GL_FRAMEBUFFER';
            case this.mGL.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: return 'GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME';
            case this.mGL.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: return 'GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE';
            case this.mGL.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: return 'GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE';
            case this.mGL.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: return 'GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL';
            case this.mGL.FRAMEBUFFER_BINDING: return 'GL_FRAMEBUFFER_BINDING';
            case this.mGL.FRAMEBUFFER_COMPLETE: return 'GL_FRAMEBUFFER_COMPLETE';
            case this.mGL.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: return 'GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT';
            case this.mGL.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: return 'GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS';
            case this.mGL.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: return 'GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT';
            case this.mGL.FRAMEBUFFER_UNSUPPORTED: return 'GL_FRAMEBUFFER_UNSUPPORTED';
            case this.mGL.FRONT: return 'GL_FRONT';
            case this.mGL.FRONT_AND_BACK: return 'GL_FRONT_AND_BACK';
            case this.mGL.FRONT_FACE: return 'GL_FRONT_FACE';
            case this.mGL.FUNC_ADD: return 'GL_FUNC_ADD';
            case this.mGL.FUNC_REVERSE_SUBTRACT: return 'GL_FUNC_REVERSE_SUBTRACT';
            case this.mGL.FUNC_SUBTRACT: return 'GL_FUNC_SUBTRACT';
            case this.mGL.GENERATE_MIPMAP_HINT: return 'GL_GENERATE_MIPMAP_HINT';
            case this.mGL.GEQUAL: return 'GL_GEQUAL';
            case this.mGL.GREATER: return 'GL_GREATER';
            case this.mGL.GREEN_BITS: return 'GL_GREEN_BITS';
            case this.mGL.HIGH_FLOAT: return 'GL_HIGH_FLOAT';
            case this.mGL.HIGH_INT: return 'GL_HIGH_INT';
            case this.mGL.IMPLEMENTATION_COLOR_READ_FORMAT: return 'GL_IMPLEMENTATION_COLOR_READ_FORMAT';
            case this.mGL.IMPLEMENTATION_COLOR_READ_TYPE: return 'GL_IMPLEMENTATION_COLOR_READ_TYPE';
            case this.mGL.INCR: return 'GL_INCR';
            case this.mGL.INCR_WRAP: return 'GL_INCR_WRAP';
            case this.mGL.INT: return 'GL_INT';
            case this.mGL.INT_VEC2: return 'GL_INT_VEC2';
            case this.mGL.INT_VEC3: return 'GL_INT_VEC3';
            case this.mGL.INT_VEC4: return 'GL_INT_VEC4';
            case this.mGL.INVALID_ENUM: return 'GL_INVALID_ENUM';
            case this.mGL.INVALID_FRAMEBUFFER_OPERATION: return 'GL_INVALID_FRAMEBUFFER_OPERATION';
            case this.mGL.INVALID_OPERATION: return 'GL_INVALID_OPERATION';
            case this.mGL.INVALID_VALUE: return 'GL_INVALID_VALUE';
            case this.mGL.INVERT: return 'GL_INVERT';
            case this.mGL.KEEP: return 'GL_KEEP';
            case this.mGL.LEQUAL: return 'GL_LEQUAL';
            case this.mGL.LESS: return 'GL_LESS';
            case this.mGL.LINEAR: return 'GL_LINEAR';
            case this.mGL.LINEAR_MIPMAP_LINEAR: return 'GL_LINEAR_MIPMAP_LINEAR';
            case this.mGL.LINEAR_MIPMAP_NEAREST: return 'GL_LINEAR_MIPMAP_NEAREST';
            case this.mGL.LINES: return 'GL_LINES';
            case this.mGL.LINE_LOOP: return 'GL_LINE_LOOP';
            case this.mGL.LINE_STRIP: return 'GL_LINE_STRIP';
            case this.mGL.LINE_WIDTH: return 'GL_LINE_WIDTH';
            case this.mGL.LINK_STATUS: return 'GL_LINK_STATUS';
            case this.mGL.LOW_FLOAT: return 'GL_LOW_FLOAT';
            case this.mGL.LOW_INT: return 'GL_LOW_INT';
            case this.mGL.LUMINANCE: return 'GL_LUMINANCE';
            case this.mGL.LUMINANCE_ALPHA: return 'GL_LUMINANCE_ALPHA';
            case this.mGL.MAX_COMBINED_TEXTURE_IMAGE_UNITS: return 'GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS';
            case this.mGL.MAX_CUBE_MAP_TEXTURE_SIZE: return 'GL_MAX_CUBE_MAP_TEXTURE_SIZE';
            case this.mGL.MAX_FRAGMENT_UNIFORM_VECTORS: return 'GL_MAX_FRAGMENT_UNIFORM_VECTORS';
            case this.mGL.MAX_RENDERBUFFER_SIZE: return 'GL_MAX_RENDERBUFFER_SIZE';
            case this.mGL.MAX_TEXTURE_IMAGE_UNITS: return 'GL_MAX_TEXTURE_IMAGE_UNITS';
            case this.mGL.MAX_TEXTURE_SIZE: return 'GL_MAX_TEXTURE_SIZE';
            case this.mGL.MAX_VARYING_VECTORS: return 'GL_MAX_VARYING_VECTORS';
            case this.mGL.MAX_VERTEX_ATTRIBS: return 'GL_MAX_VERTEX_ATTRIBS';
            case this.mGL.MAX_VERTEX_TEXTURE_IMAGE_UNITS: return 'GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS';
            case this.mGL.MAX_VERTEX_UNIFORM_VECTORS: return 'GL_MAX_VERTEX_UNIFORM_VECTORS';
            case this.mGL.MAX_VIEWPORT_DIMS: return 'GL_MAX_VIEWPORT_DIMS';
            case this.mGL.MEDIUM_FLOAT: return 'GL_MEDIUM_FLOAT';
            case this.mGL.MEDIUM_INT: return 'GL_MEDIUM_INT';
            case this.mGL.MIRRORED_REPEAT: return 'GL_MIRRORED_REPEAT';
            case this.mGL.NEAREST: return 'GL_NEAREST';
            case this.mGL.NEAREST_MIPMAP_LINEAR: return 'GL_NEAREST_MIPMAP_LINEAR';
            case this.mGL.NEAREST_MIPMAP_NEAREST: return 'GL_NEAREST_MIPMAP_NEAREST';
            case this.mGL.NEVER: return 'GL_NEVER';
            case this.mGL.NICEST: return 'GL_NICEST';
            case this.mGL.NONE: return 'GL_NONE';
            case this.mGL.NOTEQUAL: return 'GL_NOTEQUAL';
            case this.mGL.NO_ERROR: return 'GL_NO_ERROR';
            case this.mGL.ONE: return 'GL_ONE';
            case this.mGL.ONE_MINUS_CONSTANT_ALPHA: return 'GL_ONE_MINUS_CONSTANT_ALPHA';
            case this.mGL.ONE_MINUS_CONSTANT_COLOR: return 'GL_ONE_MINUS_CONSTANT_COLOR';
            case this.mGL.ONE_MINUS_DST_ALPHA: return 'GL_ONE_MINUS_DST_ALPHA';
            case this.mGL.ONE_MINUS_DST_COLOR: return 'GL_ONE_MINUS_DST_COLOR';
            case this.mGL.ONE_MINUS_SRC_ALPHA: return 'GL_ONE_MINUS_SRC_ALPHA';
            case this.mGL.ONE_MINUS_SRC_COLOR: return 'GL_ONE_MINUS_SRC_COLOR';
            case this.mGL.OUT_OF_MEMORY: return 'GL_OUT_OF_MEMORY';
            case this.mGL.PACK_ALIGNMENT: return 'GL_PACK_ALIGNMENT';
            case this.mGL.POINTS: return 'GL_POINTS';
            case this.mGL.POLYGON_OFFSET_FACTOR: return 'GL_POLYGON_OFFSET_FACTOR';
            case this.mGL.POLYGON_OFFSET_FILL: return 'GL_POLYGON_OFFSET_FILL';
            case this.mGL.POLYGON_OFFSET_UNITS: return 'GL_POLYGON_OFFSET_UNITS';
            case this.mGL.RED_BITS: return 'GL_RED_BITS';
            case this.mGL.RENDERBUFFER: return 'GL_RENDERBUFFER';
            case this.mGL.RENDERBUFFER_ALPHA_SIZE: return 'GL_RENDERBUFFER_ALPHA_SIZE';
            case this.mGL.RENDERBUFFER_BINDING: return 'GL_RENDERBUFFER_BINDING';
            case this.mGL.RENDERBUFFER_BLUE_SIZE: return 'GL_RENDERBUFFER_BLUE_SIZE';
            case this.mGL.RENDERBUFFER_DEPTH_SIZE: return 'GL_RENDERBUFFER_DEPTH_SIZE';
            case this.mGL.RENDERBUFFER_GREEN_SIZE: return 'GL_RENDERBUFFER_GREEN_SIZE';
            case this.mGL.RENDERBUFFER_HEIGHT: return 'GL_RENDERBUFFER_HEIGHT';
            case this.mGL.RENDERBUFFER_INTERNAL_FORMAT: return 'GL_RENDERBUFFER_INTERNAL_FORMAT';
            case this.mGL.RENDERBUFFER_RED_SIZE: return 'GL_RENDERBUFFER_RED_SIZE';
            case this.mGL.RENDERBUFFER_STENCIL_SIZE: return 'GL_RENDERBUFFER_STENCIL_SIZE';
            case this.mGL.RENDERBUFFER_WIDTH: return 'GL_RENDERBUFFER_WIDTH';
            case this.mGL.RENDERER: return 'GL_RENDERER';
            case this.mGL.REPEAT: return 'GL_REPEAT';
            case this.mGL.REPLACE: return 'GL_REPLACE';
            case this.mGL.RGB: return 'GL_RGB';
            case this.mGL.RGB565: return 'GL_RGB565';
            case this.mGL.RGB5_A1: return 'GL_RGB5_A1';
            case this.mGL.RGBA: return 'GL_RGBA';
            case this.mGL.RGBA4: return 'GL_RGBA4';
            case this.mGL.SAMPLER_2D: return 'GL_SAMPLER_2D';
            case this.mGL.SAMPLER_CUBE: return 'GL_SAMPLER_CUBE';
            case this.mGL.SAMPLES: return 'GL_SAMPLES';
            case this.mGL.SAMPLE_ALPHA_TO_COVERAGE: return 'GL_SAMPLE_ALPHA_TO_COVERAGE';
            case this.mGL.SAMPLE_BUFFERS: return 'GL_SAMPLE_BUFFERS';
            case this.mGL.SAMPLE_COVERAGE: return 'GL_SAMPLE_COVERAGE';
            case this.mGL.SAMPLE_COVERAGE_INVERT: return 'GL_SAMPLE_COVERAGE_INVERT';
            case this.mGL.SAMPLE_COVERAGE_VALUE: return 'GL_SAMPLE_COVERAGE_VALUE';
            case this.mGL.SCISSOR_BOX: return 'GL_SCISSOR_BOX';
            case this.mGL.SCISSOR_TEST: return 'GL_SCISSOR_TEST';
            case this.mGL.SHADER_TYPE: return 'GL_SHADER_TYPE';
            case this.mGL.SHADING_LANGUAGE_VERSION: return 'GL_SHADING_LANGUAGE_VERSION';
            case this.mGL.SHORT: return 'GL_SHORT';
            case this.mGL.SRC_ALPHA: return 'GL_SRC_ALPHA';
            case this.mGL.SRC_ALPHA_SATURATE: return 'GL_SRC_ALPHA_SATURATE';
            case this.mGL.SRC_COLOR: return 'GL_SRC_COLOR';
            case this.mGL.STATIC_DRAW: return 'GL_STATIC_DRAW';
            case this.mGL.STENCIL_ATTACHMENT: return 'GL_STENCIL_ATTACHMENT';
            case this.mGL.STENCIL_BACK_FAIL: return 'GL_STENCIL_BACK_FAIL';
            case this.mGL.STENCIL_BACK_FUNC: return 'GL_STENCIL_BACK_FUNC';
            case this.mGL.STENCIL_BACK_PASS_DEPTH_FAIL: return 'GL_STENCIL_BACK_PASS_DEPTH_FAIL';
            case this.mGL.STENCIL_BACK_PASS_DEPTH_PASS: return 'GL_STENCIL_BACK_PASS_DEPTH_PASS';
            case this.mGL.STENCIL_BACK_REF: return 'GL_STENCIL_BACK_REF';
            case this.mGL.STENCIL_BACK_VALUE_MASK: return 'GL_STENCIL_BACK_VALUE_MASK';
            case this.mGL.STENCIL_BACK_WRITEMASK: return 'GL_STENCIL_BACK_WRITEMASK';
            case this.mGL.STENCIL_BITS: return 'GL_STENCIL_BITS';
            case this.mGL.STENCIL_BUFFER_BIT: return 'GL_STENCIL_BUFFER_BIT';
            case this.mGL.STENCIL_CLEAR_VALUE: return 'GL_STENCIL_CLEAR_VALUE';
            case this.mGL.STENCIL_FAIL: return 'GL_STENCIL_FAIL';
            case this.mGL.STENCIL_FUNC: return 'GL_STENCIL_FUNC';
            //case this.mGL.STENCIL_INDEX: return 'GL_STENCIL_INDEX';
            case this.mGL.STENCIL_INDEX8: return 'GL_STENCIL_INDEX8';
            case this.mGL.STENCIL_PASS_DEPTH_FAIL: return 'GL_STENCIL_PASS_DEPTH_FAIL';
            case this.mGL.STENCIL_PASS_DEPTH_PASS: return 'GL_STENCIL_PASS_DEPTH_PASS';
            case this.mGL.STENCIL_REF: return 'GL_STENCIL_REF';
            case this.mGL.STENCIL_TEST: return 'GL_STENCIL_TEST';
            case this.mGL.STENCIL_VALUE_MASK: return 'GL_STENCIL_VALUE_MASK';
            case this.mGL.STENCIL_WRITEMASK: return 'GL_STENCIL_WRITEMASK';
            case this.mGL.STREAM_DRAW: return 'GL_STREAM_DRAW';
            case this.mGL.SUBPIXEL_BITS: return 'GL_SUBPIXEL_BITS';
            case this.mGL.TEXTURE: return 'GL_TEXTURE';
            case this.mGL.TEXTURE0: return 'GL_TEXTURE0';
            case this.mGL.TEXTURE1: return 'GL_TEXTURE1';
            case this.mGL.TEXTURE10: return 'GL_TEXTURE10';
            case this.mGL.TEXTURE11: return 'GL_TEXTURE11';
            case this.mGL.TEXTURE12: return 'GL_TEXTURE12';
            case this.mGL.TEXTURE13: return 'GL_TEXTURE13';
            case this.mGL.TEXTURE14: return 'GL_TEXTURE14';
            case this.mGL.TEXTURE15: return 'GL_TEXTURE15';
            case this.mGL.TEXTURE16: return 'GL_TEXTURE16';
            case this.mGL.TEXTURE17: return 'GL_TEXTURE17';
            case this.mGL.TEXTURE18: return 'GL_TEXTURE18';
            case this.mGL.TEXTURE19: return 'GL_TEXTURE19';
            case this.mGL.TEXTURE2: return 'GL_TEXTURE2';
            case this.mGL.TEXTURE20: return 'GL_TEXTURE20';
            case this.mGL.TEXTURE21: return 'GL_TEXTURE21';
            case this.mGL.TEXTURE22: return 'GL_TEXTURE22';
            case this.mGL.TEXTURE23: return 'GL_TEXTURE23';
            case this.mGL.TEXTURE24: return 'GL_TEXTURE24';
            case this.mGL.TEXTURE25: return 'GL_TEXTURE25';
            case this.mGL.TEXTURE26: return 'GL_TEXTURE26';
            case this.mGL.TEXTURE27: return 'GL_TEXTURE27';
            case this.mGL.TEXTURE28: return 'GL_TEXTURE28';
            case this.mGL.TEXTURE29: return 'GL_TEXTURE29';
            case this.mGL.TEXTURE3: return 'GL_TEXTURE3';
            case this.mGL.TEXTURE30: return 'GL_TEXTURE30';
            case this.mGL.TEXTURE31: return 'GL_TEXTURE31';
            case this.mGL.TEXTURE4: return 'GL_TEXTURE4';
            case this.mGL.TEXTURE5: return 'GL_TEXTURE5';
            case this.mGL.TEXTURE6: return 'GL_TEXTURE6';
            case this.mGL.TEXTURE7: return 'GL_TEXTURE7';
            case this.mGL.TEXTURE8: return 'GL_TEXTURE8';
            case this.mGL.TEXTURE9: return 'GL_TEXTURE9';
            case this.mGL.TEXTURE_2D: return 'GL_TEXTURE_2D';
            case this.mGL.TEXTURE_BINDING_2D: return 'GL_TEXTURE_BINDING_2D';
            case this.mGL.TEXTURE_BINDING_CUBE_MAP: return 'GL_TEXTURE_BINDING_CUBE_MAP';
            case this.mGL.TEXTURE_CUBE_MAP: return 'GL_TEXTURE_CUBE_MAP';
            case this.mGL.TEXTURE_CUBE_MAP_NEGATIVE_X: return 'GL_TEXTURE_CUBE_MAP_NEGATIVE_X';
            case this.mGL.TEXTURE_CUBE_MAP_NEGATIVE_Y: return 'GL_TEXTURE_CUBE_MAP_NEGATIVE_Y';
            case this.mGL.TEXTURE_CUBE_MAP_NEGATIVE_Z: return 'GL_TEXTURE_CUBE_MAP_NEGATIVE_Z';
            case this.mGL.TEXTURE_CUBE_MAP_POSITIVE_X: return 'GL_TEXTURE_CUBE_MAP_POSITIVE_X';
            case this.mGL.TEXTURE_CUBE_MAP_POSITIVE_Y: return 'GL_TEXTURE_CUBE_MAP_POSITIVE_Y';
            case this.mGL.TEXTURE_CUBE_MAP_POSITIVE_Z: return 'GL_TEXTURE_CUBE_MAP_POSITIVE_Z';
            case this.mGL.TEXTURE_MAG_FILTER: return 'GL_TEXTURE_MAG_FILTER';
            case this.mGL.TEXTURE_MIN_FILTER: return 'GL_TEXTURE_MIN_FILTER';
            case this.mGL.TEXTURE_WRAP_S: return 'GL_TEXTURE_WRAP_S';
            case this.mGL.TEXTURE_WRAP_T: return 'GL_TEXTURE_WRAP_T';
            case this.mGL.TRIANGLES: return 'GL_TRIANGLES';
            case this.mGL.TRIANGLE_FAN: return 'GL_TRIANGLE_FAN';
            case this.mGL.TRIANGLE_STRIP: return 'GL_TRIANGLE_STRIP';
            case this.mGL.UNPACK_ALIGNMENT: return 'GL_UNPACK_ALIGNMENT';
            case this.mGL.UNPACK_COLORSPACE_CONVERSION_WEBGL: return 'GL_UNPACK_COLORSPACE_CONVERSION_WEBGL';
            case this.mGL.UNPACK_FLIP_Y_WEBGL: return 'GL_UNPACK_FLIP_Y_WEBGL';
            case this.mGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL: return 'GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL';
            case this.mGL.UNSIGNED_BYTE: return 'GL_UNSIGNED_BYTE';
            case this.mGL.UNSIGNED_INT: return 'GL_UNSIGNED_INT';
            case this.mGL.UNSIGNED_SHORT: return 'GL_UNSIGNED_SHORT';
            case this.mGL.UNSIGNED_SHORT_4_4_4_4: return 'GL_UNSIGNED_SHORT_4_4_4_4';
            case this.mGL.UNSIGNED_SHORT_5_5_5_1: return 'GL_UNSIGNED_SHORT_5_5_5_1';
            case this.mGL.UNSIGNED_SHORT_5_6_5: return 'GL_UNSIGNED_SHORT_5_6_5';
            case this.mGL.VALIDATE_STATUS: return 'GL_VALIDATE_STATUS';
            case this.mGL.VENDOR: return 'GL_VENDOR';
            case this.mGL.VERSION: return 'GL_VERSION';
            case this.mGL.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: return 'GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING';
            case this.mGL.VERTEX_ATTRIB_ARRAY_ENABLED: return 'GL_VERTEX_ATTRIB_ARRAY_ENABLED';
            case this.mGL.VERTEX_ATTRIB_ARRAY_NORMALIZED: return 'GL_VERTEX_ATTRIB_ARRAY_NORMALIZED';
            case this.mGL.VERTEX_ATTRIB_ARRAY_POINTER: return 'GL_VERTEX_ATTRIB_ARRAY_POINTER';
            case this.mGL.VERTEX_ATTRIB_ARRAY_SIZE: return 'GL_VERTEX_ATTRIB_ARRAY_SIZE';
            case this.mGL.VERTEX_ATTRIB_ARRAY_STRIDE: return 'GL_VERTEX_ATTRIB_ARRAY_STRIDE';
            case this.mGL.VERTEX_ATTRIB_ARRAY_TYPE: return 'GL_VERTEX_ATTRIB_ARRAY_TYPE';
            case this.mGL.VERTEX_SHADER: return 'GL_VERTEX_SHADER';
            case this.mGL.VIEWPORT: return 'GL_VIEWPORT';
            case this.mGL.ZERO: return 'GL_ZERO';
        }
        return 'invalid';
    };

    public activeTexture( texture: number ): void
    {
        this.LogFunctionCall(
            'glActiveTexture',
            this.GetOpenGLConstName( texture ) );
        this.mGL.activeTexture( texture );
    };

    public attachShader( program: WebGLProgram, shader: WebGLShader ): void
    {
        this.LogFunctionCall(
            'glAttachShader',
            program,
            shader );
        this.mGL.attachShader( program, shader );
    };

    public bindAttribLocation( program: WebGLProgram, index: number, name: string ): void
    {
        this.LogFunctionCall(
            'glBindAttribLocation',
            program,
            index,
            name );
        this.mGL.bindAttribLocation( program, index, name );
    };

    public bindBuffer( target: number, buffer: WebGLBuffer ): void
    {
        this.LogFunctionCall(
            'glBindBuffer',
            this.GetOpenGLConstName( target ),
            buffer );
        this.mGL.bindBuffer( target, buffer );
    };

    public bindFramebuffer( target: number, framebuffer: WebGLFramebuffer ): void
    {
        this.LogFunctionCall(
            'glBindFramebuffer',
            this.GetOpenGLConstName( target ),
            framebuffer );
        this.mGL.bindFramebuffer( target, framebuffer );
    };

    public bindRenderbuffer( target: number, renderbuffer: WebGLRenderbuffer ): void
    {
        this.LogFunctionCall(
            'glBindRenderbuffer',
            this.GetOpenGLConstName( target ),
            renderbuffer );
        this.mGL.bindRenderbuffer( target, renderbuffer );
    };

    public bindTexture( target: number, texture: WebGLTexture ): void
    {
        this.LogFunctionCall(
            'glBindTexture',
            this.GetOpenGLConstName( target ),
            texture );
        this.mGL.bindTexture( target, texture );
    };

    public blendColor( red: number, green: number, blue: number, alpha: number ): void
    {
        this.LogFunctionCall(
            'glBlendColor',
            red,
            green,
            blue,
            alpha );
        this.mGL.blendColor( red, green, blue, alpha );
    };

    public blendEquation( mode: number ): void
    {
        this.LogFunctionCall(
            'glBlendEquation',
            this.GetOpenGLConstName( mode ) );
        this.mGL.blendEquation( mode );
    };

    public blendEquationSeparate( modeRGB: number, modeAlpha: number ): void
    {
        this.LogFunctionCall(
            'glBlendEquationSeparate',
            this.GetOpenGLConstName( modeRGB ),
            this.GetOpenGLConstName( modeAlpha ) );
        this.mGL.blendEquationSeparate( modeRGB, modeAlpha );
    };

    public blendFunc( sfactor: number, dfactor: number ): void
    {
        this.LogFunctionCall(
            'glBlendFunc',
            this.GetOpenGLConstName( sfactor ),
            this.GetOpenGLConstName( dfactor ) );
        this.mGL.blendFunc( sfactor, dfactor );
    };

    public blendFuncSeparate( srcRGB: number, dstRGB: number, srcAlpha: number, dstAlpha: number ): void
    {
        this.LogFunctionCall(
            'glBlendFunc',
            this.GetOpenGLConstName( srcRGB ),
            this.GetOpenGLConstName( dstRGB ),
            this.GetOpenGLConstName( srcAlpha ),
            this.GetOpenGLConstName( dstAlpha ) );
        this.mGL.blendFuncSeparate( srcRGB, dstRGB, srcAlpha, dstAlpha );
    };

    public bufferData( target: number, size: any, usage: number ): void
    {
        this.LogFunctionCall(
            'glBufferData',
            this.GetOpenGLConstName( target ),
            size,
            this.GetOpenGLConstName( usage ) );
        this.mGL.bufferData( target, size, usage );
    };

    public bufferSubData( target: number, offset: number, data: any ): void
    {
        this.LogFunctionCall( 'glBufferSubData',
            this.GetOpenGLConstName( target ),
            offset,
            data );
        this.mGL.bufferSubData( target, offset, data );
    };

    public checkFramebufferStatus( target: number ): number
    {
        let result = this.mGL.checkFramebufferStatus( target );
        this.LogReturningFunctionCall(
            'glCheckFramebufferStatus',
            this.GetOpenGLConstName( result ),
            this.GetOpenGLConstName( target ) );
        return result;
    };

    public clear( mask: number ): void
    {
        this.LogFunctionCall(
            'glClear',
            mask );
        this.mGL.clear( mask );
    };

    public clearColor( red: number, green: number, blue: number, alpha: number ): void
    {
        this.LogFunctionCall(
            'glClearColor',
            red,
            green,
            blue,
            alpha );
        this.mGL.clearColor( red, green, blue, alpha );
    };

    public clearDepth( depth: number ): void
    {
        this.LogFunctionCall(
            'glClearDepth',
            depth );
        this.mGL.clearDepth( depth );
    };

    public clearStencil( s: number ): void
    {
        this.LogFunctionCall(
            'glClearStencil',
            s );
        this.mGL.clearStencil( s );
    };

    public colorMask( red: boolean, green: boolean, blue: boolean, alpha: boolean ): void
    {
        this.LogFunctionCall(
            'glColorMask',
            red,
            green,
            blue,
            alpha );
        this.mGL.colorMask( red, green, blue, alpha );
    };

    public compileShader( shader: WebGLShader ): void
    {
        this.LogFunctionCall(
            'glCompileShader',
            shader );
        this.mGL.compileShader( shader );
    };

    public compressedTexImage2D( target: number, level: number, internalFormat: number, width: number, height: number, border: number, data: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView ): void
    {
        this.LogFunctionCall(
            'glCompressedTexImage2D',
            this.GetOpenGLConstName( target ),
            level,
            this.GetOpenGLConstName( internalFormat ),
            width,
            height,
            border,
            data );
        this.mGL.compressedTexImage2D( target, level, internalFormat, width, height, border, data );
    };

    public compressedTexSubImage2D( target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, data: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView ): void
    {
        this.LogFunctionCall(
            'glCompressedTexSubImage2D',
            this.GetOpenGLConstName( target ),
            level,
            xoffset,
            yoffset,
            width,
            height,
            this.GetOpenGLConstName( format ),
            data );
        this.mGL.compressedTexSubImage2D( target, level, xoffset, yoffset, width, height, format, data );
    };

    public copyTexImage2D( target: number, level: number, internalFormat: number, x: number, y: number, width: number, height: number, border: number ): void
    {
        this.LogFunctionCall(
            'glCopyTexImage2D',
            this.GetOpenGLConstName( target ),
            level,
            this.GetOpenGLConstName( internalFormat ),
            x,
            y,
            width,
            height,
            border );
        this.mGL.copyTexImage2D( target, level, internalFormat, x, y, width, height, border );
    };

    public copyTexSubImage2D( target: number, level: number, xoffset: number, yoffset: number, x: number, y: number, width: number, height: number ): void
    {
        this.LogFunctionCall(
            'glCopyTexSubImage2D',
            this.GetOpenGLConstName( target ),
            level,
            xoffset,
            yoffset,
            x,
            y,
            width,
            height );
        this.mGL.copyTexSubImage2D( target, level, xoffset, yoffset, x, y, width, height );
    };

    public createBuffer(): WebGLBuffer
    {
        this.LogFunctionCall(
            'glCreateBuffer' );
        return this.mGL.createBuffer();
    };

    public createFramebuffer(): WebGLFramebuffer
    {
        this.LogFunctionCall(
            'glCreateFramebuffer' );
        return this.mGL.createFramebuffer();
    };

    public createProgram(): WebGLProgram
    {
        this.LogFunctionCall(
            'glCreateProgram' );
        return this.mGL.createProgram();
    };

    public createRenderbuffer(): WebGLRenderbuffer
    {
        this.LogFunctionCall(
            'glCreateRenderbuffer' );
        return this.mGL.createRenderbuffer();
    };

    public createShader( type: number ): WebGLShader
    {
        this.LogFunctionCall(
            'glCreateShader',
            this.GetOpenGLConstName( type ) );
        return this.mGL.createShader( type );
    };

    public createTexture(): WebGLTexture
    {
        this.LogFunctionCall(
            'glCreateTexture' );
        return this.mGL.createTexture();
    };

    public cullFace(): void
    {

    };

    public deleteBuffer(): void
    {

    };

    public deleteFramebuffer(): void
    {

    };

    public deleteProgram(): void
    {

    };

    public deleteRenderbuffer(): void
    {

    };

    public deleteShader(): void
    {

    };

    public deleteTexture(): void
    {

    };

    public depthFunc(): void
    {

    };

    public depthMask(): void
    {

    };

    public depthRange(): void
    {

    };

    public detachShader(): void
    {

    };

    public disable( cap: number ): void
    {
        this.LogFunctionCall(
            'glDisable',
            this.GetOpenGLConstName( cap ) );
        this.mGL.disable( cap );
    };

    public disableVertexAttribArray( index: number ): void
    {
        this.LogFunctionCall(
            'glDisableVertexAttribArray',
            index );
        this.mGL.disableVertexAttribArray( index );
    };

    public drawArrays( mode: number, first: number, count: number ): void
    {
        this.LogDrawFunctionCall(
            'glDrawArrays',
            this.GetOpenGLConstName( mode ),
            first,
            count );
        this.mGL.drawArrays( mode, first, count );
    };

    public drawElements( mode: number, count: number, type: number, offset: number ): void
    {
        this.LogDrawFunctionCall(
            'glDrawElements',
            this.GetOpenGLConstName( mode ),
            count,
            this.GetOpenGLConstName( type ),
            offset );
        this.mGL.drawElements( mode, count, type, offset );
    };

    public enable( cap: number ): void
    {
        this.LogFunctionCall(
            'glEnable',
            this.GetOpenGLConstName( cap ) );
        this.mGL.enable( cap );
    };

    public enableVertexAttribArray( index: number ): void
    {
        this.LogFunctionCall(
            'glEnableVertexAttribArray',
            index );
        this.mGL.enableVertexAttribArray( index );
    };

    public finish(): void
    {
        this.LogFunctionCall(
            'glFinish' );
        this.mGL.finish();
    };

    public flush(): void
    {
        this.LogFunctionCall(
            'glFlush' );
        this.mGL.flush();
    };

    public framebufferRenderbuffer(): void
    {

    };

    public framebufferTexture2D( target: number, attachment: number, textarget: number, texture: WebGLTexture, level: number ): void
    {
        this.LogFunctionCall(
            'glFramebufferTexture2D',
            this.GetOpenGLConstName( target ),
            this.GetOpenGLConstName( attachment ),
            this.GetOpenGLConstName( textarget ),
            texture,
            level );
        this.mGL.framebufferTexture2D( target, attachment, textarget, texture, level );
    };

    public frontFace(): void
    {

    };

    public generateMipmap(): void
    {

    };

    public getActiveAttrib( program: WebGLProgram, index: number ): WebGLActiveInfo
    {
        let result = this.mGL.getActiveAttrib( program, index );
        this.LogReturningFunctionCall(
            'glGetActiveAttrib',
            result,
            program,
            index );
        return result;
    };

    public getActiveUniform( program: WebGLProgram, index: number ): WebGLActiveInfo
    {
        let result = this.mGL.getActiveUniform( program, index );
        this.LogReturningFunctionCall(
            'glGetActiveUniform',
            result,
            program,
            index );
        return result;
    };

    public getAttachedShaders( program: WebGLProgram ): WebGLShader[]
    {
        let result = this.mGL.getAttachedShaders( program );
        this.LogReturningFunctionCall(
            'glGetAttachedShaders',
            result,
            program );
        return result;
    };

    public getAttribLocation( program: WebGLProgram, name: string ): number
    {
        let result = this.mGL.getAttribLocation( program, name );
        this.LogReturningFunctionCall(
            'glGetAttribLocation',
            result,
            program,
            name );
        return result;
    };

    public getBufferParameter( target: number, pname: number ): any
    {
        let result = this.mGL.getBufferParameter( target, pname );
        this.LogReturningFunctionCall(
            'glGetBufferParameter',
            result,
            this.GetOpenGLConstName( target ),
            this.GetOpenGLConstName( pname ) );
        return result;
    };

    public getContextAttributes(): WebGLContextAttributes
    {
        let result = this.mGL.getContextAttributes();
        this.LogReturningFunctionCall(
            'glGetContextAttributes',
            result );
        return result;
    };

    public getError(): number
    {
        let result = this.mGL.getError();
        this.LogReturningFunctionCall(
            'glGetError',
            this.GetOpenGLConstName( result ) );
        return result;
    };

    public getExtension( extensionName: string ): any
    {
        let result = this.mGL.getExtension( extensionName );
        this.LogReturningFunctionCall(
            'glGetExtension',
            result,
            extensionName );
        return result;
    };

    public getFramebufferAttachmentParameter(): void
    {

    };

    public getParameter(): void
    {

    };

    public getProgramInfoLog( program: WebGLProgram ): string
    {
        let result = this.mGL.getProgramInfoLog( program );
        this.LogReturningFunctionCall(
            'glGetProgramInfoLog',
            result,
            program );
        return result;
    };

    public getProgramParameter( program: WebGLProgram, pname: number ): void
    {
        let result = this.mGL.getProgramParameter( program, pname );
        this.LogReturningFunctionCall(
            'glGetProgramParameter',
            result,
            program,
            this.GetOpenGLConstName( pname ) );
        return result;
    };

    public getRenderbufferParameter(): void
    {

    };

    public getShaderInfoLog( shader: WebGLShader ): string
    {
        let result = this.mGL.getShaderInfoLog( shader );
        this.LogReturningFunctionCall(
            'glGetShaderInfoLog',
            result,
            shader );
        return result;
    };

    public getShaderParameter( shader: WebGLShader, pname: number ): any
    {
        let result = this.mGL.getShaderParameter( shader, pname );
        this.LogReturningFunctionCall(
            'glGetShaderParameter',
            result,
            shader,
            this.GetOpenGLConstName( pname ) );
        return result;
    };

    public getShaderPrecisionFormat( shadertype: number, precisiontype: number ): WebGLShaderPrecisionFormat
    {
        let result = this.mGL.getShaderPrecisionFormat( shadertype, precisiontype );
        this.LogReturningFunctionCall(
            'glGetShaderPrecisionFormat',
            result,
            this.GetOpenGLConstName( shadertype ),
            this.GetOpenGLConstName( precisiontype ) );
        return result;
    };

    public getShaderSource( shader: WebGLShader ): string
    {
        let result = this.mGL.getShaderSource( shader );
        this.LogReturningFunctionCall(
            'glGetShaderSource',
            result,
            shader );
        return result;
    };

    public getSupportedExtensions(): string[]
    {
        let result = this.mGL.getSupportedExtensions();
        this.LogReturningFunctionCall(
            'glGetSupportedExtensions',
            result );
        return result;
    };

    public getTexParameter(): void
    {

    };

    public getUniform(): void
    {

    };

    public getUniformLocation( program: WebGLProgram, name: string ): WebGLUniformLocation
    {
        let result = this.mGL.getUniformLocation( program, name );
        this.LogReturningFunctionCall(
            'glGetUniformLocation',
            result,
            program,
            name );
        return result;
    };

    public getVertexAttrib( index: number, pname: number ): any
    {
        let result = this.mGL.getVertexAttrib( index, pname );
        this.LogReturningFunctionCall(
            'glGetVertexAttrib',
            result,
            index,
            this.GetOpenGLConstName( pname ) );
        return result;
    };

    public getVertexAttribOffset( index: number, pname: number ): number
    {
        let result = this.mGL.getVertexAttribOffset( index, pname );
        this.LogReturningFunctionCall(
            'glGetVertexAttribOffset',
            result,
            index,
            this.GetOpenGLConstName( pname ) );
        return result;
    };

    public hint( target: number, mode: number ): void
    {
        this.LogFunctionCall(
            'glHint',
            this.GetOpenGLConstName( target ),
            this.GetOpenGLConstName( mode ) );
        this.mGL.hint( target, mode );
    };

    public isBuffer( buffer: WebGLBuffer ): boolean
    {
        let result = this.mGL.isBuffer( buffer );
        this.LogReturningFunctionCall(
            'glIsBuffer',
            result,
            buffer );
        return result;
    };

    public isContextLost(): boolean
    {
        let result = this.mGL.isContextLost();
        this.LogReturningFunctionCall(
            'glIsContextLost',
            result );
        return result;
    };

    public isEnabled( cap: number ): boolean
    {
        let result = this.mGL.isEnabled( cap );
        this.LogReturningFunctionCall(
            'glIsEnabled',
            result,
            this.GetOpenGLConstName( cap ) );
        return result;
    };

    public isFramebuffer( framebuffer: WebGLFramebuffer ): boolean
    {
        let result = this.mGL.isFramebuffer( framebuffer );
        this.LogReturningFunctionCall(
            'glIsFramebuffer',
            result,
            framebuffer );
        return result;
    };

    public isProgram( program: WebGLProgram ): boolean
    {
        let result = this.mGL.isProgram( program );
        this.LogReturningFunctionCall(
            'glIsProgram',
            result,
            program );
        return result;
    };

    public isRenderbuffer( renderbuffer: WebGLRenderbuffer ): boolean
    {
        let result = this.mGL.isRenderbuffer( renderbuffer );
        this.LogReturningFunctionCall(
            'glIsRenderbuffer',
            result,
            renderbuffer );
        return result;
    };

    public isShader( shader: WebGLShader ): boolean
    {
        let result = this.mGL.isShader( shader );
        this.LogReturningFunctionCall(
            'glIsShader',
            result,
            shader );
        return result;
    };

    public isTexture( texture: WebGLTexture ): boolean
    {
        let result = this.mGL.isTexture( texture );
        this.LogReturningFunctionCall(
            'glIsTexture',
            result,
            texture );
        return result;
    };

    public lineWidth(): void
    {

    };

    public linkProgram( program: WebGLProgram ): void
    {
        this.LogFunctionCall(
            'glLinkProgram',
            program );
        this.mGL.linkProgram( program );
    };

    public pixelStorei(): void
    {

    };

    public polygonOffset(): void
    {

    };

    public readPixels(): void
    {

    };

    public renderbufferStorage(): void
    {

    };

    public sampleCoverage(): void
    {

    };

    public scissor(): void
    {

    };

    public shaderSource( shader: WebGLShader, source: string ): void
    {
        this.LogFunctionCall(
            'glShaderSource',
            shader,
            '"' + source + '"' );
        this.mGL.shaderSource( shader, source );
    };

    public stencilFunc(): void
    {

    };

    public stencilFuncSeparate(): void
    {

    };

    public stencilMask(): void
    {

    };

    public stencilMaskSeparate(): void
    {

    };

    public stencilOp(): void
    {

    };

    public stencilOpSeparate(): void
    {

    };

    public texImage2D( target: number, level: number, internalFormat: number, width: number, height: number, border: number, format: number, type: number, pixels: ArrayBufferView ): void;
    public texImage2D( target: number, level: number, internalFormat: number, width: number, height: number, pixels: ImageData | ImageBitmap | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement ): void;
    
    public texImage2D( target: number, level: number, internalFormat: number, width: number, height: number, borderOrPixels: number | ImageData | ImageBitmap | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, format?: number, type?: number, pixels?: ArrayBufferView ): void
    {
        if ( typeof borderOrPixels === "number" )
        {
            this.LogFunctionCall(
                'glTexImage2D',
                this.GetOpenGLConstName( target ),
                level,
                this.GetOpenGLConstName( internalFormat ),
                width,
                height,
                borderOrPixels,
                this.GetOpenGLConstName( format ),
                this.GetOpenGLConstName( type ),
                pixels );
            this.mGL.texImage2D( target, level, internalFormat, width, height, borderOrPixels, format, type, pixels );
        }
        else
        {
            this.LogFunctionCall(
                'glTexImage2D',
                this.GetOpenGLConstName( target ),
                level,
                this.GetOpenGLConstName( internalFormat ),
                width,
                height,
                borderOrPixels );
            this.mGL.texImage2D( target, level, internalFormat, width, height, borderOrPixels );
        }
    };

    public texParameterf(): void
    {

    };

    public texParameteri( target: number, pname: number, param: number ): void
    {
        this.LogFunctionCall(
            'glTexParameteri',
            this.GetOpenGLConstName( target ),
            this.GetOpenGLConstName( pname ),
            this.GetOpenGLConstName( param ) );
        this.mGL.texParameteri( target, pname, param );
    };

    public texSubImage2D(): void
    {

    };

    public uniform1f(): void
    {

    };

    public uniform1fv(): void
    {

    };

    public uniform1i(): void
    {

    };

    public uniform1iv(): void
    {

    };

    public uniform2f(): void
    {

    };

    public uniform2fv(): void
    {

    };

    public uniform2i(): void
    {

    };

    public uniform2iv(): void
    {

    };

    public uniform3f(): void
    {

    };

    public uniform3fv(): void
    {

    };

    public uniform3i(): void
    {

    };

    public uniform3iv(): void
    {

    };

    public uniform4f(): void
    {

    };

    public uniform4fv(): void
    {

    };

    public uniform4i(): void
    {

    };

    public uniform4iv(): void
    {

    };

    public uniformMatrix2fv(): void
    {

    };

    public uniformMatrix3fv(): void
    {

    };

    public uniformMatrix4fv(): void
    {

    };

    public useProgram( program: WebGLProgram ): void
    {
        this.LogFunctionCall(
            'glUseProgram',
            program );
        this.mGL.useProgram( program );
    };

    public validateProgram( program: WebGLProgram ): void
    {
        this.LogFunctionCall(
            'glValidateProgram',
            program );
        this.mGL.validateProgram( program );
    };

    public vertexAttrib1f( index: number, x: number ): void
    {
        this.LogFunctionCall(
            'glVertexAttrib1f',
            index,
            x );
        this.mGL.vertexAttrib1f( index, x );
    };

    public vertexAttrib1fv( index: number, values: number[] | Float32Array ): void
    {
        this.LogFunctionCall(
            'glVertexAttrib1fv',
            index,
            values );
        this.mGL.vertexAttrib1fv( index, values );
    };

    public vertexAttrib2f( index: number, x: number, y: number ): void
    {
        this.LogFunctionCall(
            'glVertexAttrib2f',
            index,
            x, y );
        this.mGL.vertexAttrib2f( index, x, y );
    };

    public vertexAttrib2fv( index: number, values: number[] | Float32Array ): void
    {
        this.LogFunctionCall(
            'glVertexAttrib2fv',
            index,
            values );
        this.mGL.vertexAttrib2fv( index, values );
    };

    public vertexAttrib3f( index: number, x: number, y: number, z: number ): void
    {
        this.LogFunctionCall(
            'glVertexAttrib3f',
            index,
            x, y, z );
        this.mGL.vertexAttrib3f( index, x, y, z );
    };

    public vertexAttrib3fv( index: number, values: number[] | Float32Array ): void
    {
        this.LogFunctionCall(
            'glVertexAttrib3fv',
            index,
            values );
        this.mGL.vertexAttrib3fv( index, values );
    };

    public vertexAttrib4f( index: number, x: number, y: number, z: number, w: number ): void
    {
        this.LogFunctionCall(
            'glVertexAttrib4f',
            index,
            x, y, z, w );
        this.mGL.vertexAttrib4f( index, x, y, z, w );
    };

    public vertexAttrib4fv( index: number, values: number[] | Float32Array ): void
    {
        this.LogFunctionCall(
            'glVertexAttrib4fv',
            index,
            values );
        this.mGL.vertexAttrib4fv( index, values );
    };

    public vertexAttribPointer( index: number, size: number, type: number, normalized: boolean, stride: number, offset: number ): void
    {
        this.LogFunctionCall(
            'glVertexAttribPointer',
            index,
            size,
            this.GetOpenGLConstName( type ),
            normalized,
            stride,
            offset );
        this.mGL.vertexAttribPointer( index, size, type, normalized, stride, offset );
    };

    public viewport( x: number, y: number, width: number, height: number ): void
    {
        this.LogFunctionCall(
            'glViewport',
            x,
            y,
            width,
            height );
        this.mGL.viewport( x, y, width, height );
    };

    readonly ACTIVE_ATTRIBUTES: number;
    readonly ACTIVE_TEXTURE: number;
    readonly ACTIVE_UNIFORMS: number;
    readonly ALIASED_LINE_WIDTH_RANGE: number;
    readonly ALIASED_POINT_SIZE_RANGE: number;
    readonly ALPHA: number;
    readonly ALPHA_BITS: number;
    readonly ALWAYS: number;
    readonly ARRAY_BUFFER: number;
    readonly ARRAY_BUFFER_BINDING: number;
    readonly ATTACHED_SHADERS: number;
    readonly BACK: number;
    readonly BLEND: number;
    readonly BLEND_COLOR: number;
    readonly BLEND_DST_ALPHA: number;
    readonly BLEND_DST_RGB: number;
    readonly BLEND_EQUATION: number;
    readonly BLEND_EQUATION_ALPHA: number;
    readonly BLEND_EQUATION_RGB: number;
    readonly BLEND_SRC_ALPHA: number;
    readonly BLEND_SRC_RGB: number;
    readonly BLUE_BITS: number;
    readonly BOOL: number;
    readonly BOOL_VEC2: number;
    readonly BOOL_VEC3: number;
    readonly BOOL_VEC4: number;
    readonly BROWSER_DEFAULT_WEBGL: number;
    readonly BUFFER_SIZE: number;
    readonly BUFFER_USAGE: number;
    readonly BYTE: number;
    readonly CCW: number;
    readonly CLAMP_TO_EDGE: number;
    readonly COLOR_ATTACHMENT0: number;
    readonly COLOR_BUFFER_BIT: number;
    readonly COLOR_CLEAR_VALUE: number;
    readonly COLOR_WRITEMASK: number;
    readonly COMPILE_STATUS: number;
    readonly COMPRESSED_TEXTURE_FORMATS: number;
    readonly CONSTANT_ALPHA: number;
    readonly CONSTANT_COLOR: number;
    readonly CONTEXT_LOST_WEBGL: number;
    readonly CULL_FACE: number;
    readonly CULL_FACE_MODE: number;
    readonly CURRENT_PROGRAM: number;
    readonly CURRENT_VERTEX_ATTRIB: number;
    readonly CW: number;
    readonly DECR: number;
    readonly DECR_WRAP: number;
    readonly DELETE_STATUS: number;
    readonly DEPTH_ATTACHMENT: number;
    readonly DEPTH_BITS: number;
    readonly DEPTH_BUFFER_BIT: number;
    readonly DEPTH_CLEAR_VALUE: number;
    readonly DEPTH_COMPONENT: number;
    readonly DEPTH_COMPONENT16: number;
    readonly DEPTH_FUNC: number;
    readonly DEPTH_RANGE: number;
    readonly DEPTH_STENCIL: number;
    readonly DEPTH_STENCIL_ATTACHMENT: number;
    readonly DEPTH_TEST: number;
    readonly DEPTH_WRITEMASK: number;
    readonly DITHER: number;
    readonly DONT_CARE: number;
    readonly DST_ALPHA: number;
    readonly DST_COLOR: number;
    readonly DYNAMIC_DRAW: number;
    readonly ELEMENT_ARRAY_BUFFER: number;
    readonly ELEMENT_ARRAY_BUFFER_BINDING: number;
    readonly EQUAL: number;
    readonly FASTEST: number;
    readonly FLOAT: number;
    readonly FLOAT_MAT2: number;
    readonly FLOAT_MAT3: number;
    readonly FLOAT_MAT4: number;
    readonly FLOAT_VEC2: number;
    readonly FLOAT_VEC3: number;
    readonly FLOAT_VEC4: number;
    readonly FRAGMENT_SHADER: number;
    readonly FRAMEBUFFER: number;
    readonly FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: number;
    readonly FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: number;
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: number;
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: number;
    readonly FRAMEBUFFER_BINDING: number;
    readonly FRAMEBUFFER_COMPLETE: number;
    readonly FRAMEBUFFER_INCOMPLETE_ATTACHMENT: number;
    readonly FRAMEBUFFER_INCOMPLETE_DIMENSIONS: number;
    readonly FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: number;
    readonly FRAMEBUFFER_UNSUPPORTED: number;
    readonly FRONT: number;
    readonly FRONT_AND_BACK: number;
    readonly FRONT_FACE: number;
    readonly FUNC_ADD: number;
    readonly FUNC_REVERSE_SUBTRACT: number;
    readonly FUNC_SUBTRACT: number;
    readonly GENERATE_MIPMAP_HINT: number;
    readonly GEQUAL: number;
    readonly GREATER: number;
    readonly GREEN_BITS: number;
    readonly HIGH_FLOAT: number;
    readonly HIGH_INT: number;
    readonly IMPLEMENTATION_COLOR_READ_FORMAT: number;
    readonly IMPLEMENTATION_COLOR_READ_TYPE: number;
    readonly INCR: number;
    readonly INCR_WRAP: number;
    readonly INT: number;
    readonly INT_VEC2: number;
    readonly INT_VEC3: number;
    readonly INT_VEC4: number;
    readonly INVALID_ENUM: number;
    readonly INVALID_FRAMEBUFFER_OPERATION: number;
    readonly INVALID_OPERATION: number;
    readonly INVALID_VALUE: number;
    readonly INVERT: number;
    readonly KEEP: number;
    readonly LEQUAL: number;
    readonly LESS: number;
    readonly LINEAR: number;
    readonly LINEAR_MIPMAP_LINEAR: number;
    readonly LINEAR_MIPMAP_NEAREST: number;
    readonly LINES: number;
    readonly LINE_LOOP: number;
    readonly LINE_STRIP: number;
    readonly LINE_WIDTH: number;
    readonly LINK_STATUS: number;
    readonly LOW_FLOAT: number;
    readonly LOW_INT: number;
    readonly LUMINANCE: number;
    readonly LUMINANCE_ALPHA: number;
    readonly MAX_COMBINED_TEXTURE_IMAGE_UNITS: number;
    readonly MAX_CUBE_MAP_TEXTURE_SIZE: number;
    readonly MAX_FRAGMENT_UNIFORM_VECTORS: number;
    readonly MAX_RENDERBUFFER_SIZE: number;
    readonly MAX_TEXTURE_IMAGE_UNITS: number;
    readonly MAX_TEXTURE_SIZE: number;
    readonly MAX_VARYING_VECTORS: number;
    readonly MAX_VERTEX_ATTRIBS: number;
    readonly MAX_VERTEX_TEXTURE_IMAGE_UNITS: number;
    readonly MAX_VERTEX_UNIFORM_VECTORS: number;
    readonly MAX_VIEWPORT_DIMS: number;
    readonly MEDIUM_FLOAT: number;
    readonly MEDIUM_INT: number;
    readonly MIRRORED_REPEAT: number;
    readonly NEAREST: number;
    readonly NEAREST_MIPMAP_LINEAR: number;
    readonly NEAREST_MIPMAP_NEAREST: number;
    readonly NEVER: number;
    readonly NICEST: number;
    readonly NONE: number;
    readonly NOTEQUAL: number;
    readonly NO_ERROR: number;
    readonly ONE: number;
    readonly ONE_MINUS_CONSTANT_ALPHA: number;
    readonly ONE_MINUS_CONSTANT_COLOR: number;
    readonly ONE_MINUS_DST_ALPHA: number;
    readonly ONE_MINUS_DST_COLOR: number;
    readonly ONE_MINUS_SRC_ALPHA: number;
    readonly ONE_MINUS_SRC_COLOR: number;
    readonly OUT_OF_MEMORY: number;
    readonly PACK_ALIGNMENT: number;
    readonly POINTS: number;
    readonly POLYGON_OFFSET_FACTOR: number;
    readonly POLYGON_OFFSET_FILL: number;
    readonly POLYGON_OFFSET_UNITS: number;
    readonly RED_BITS: number;
    readonly RENDERBUFFER: number;
    readonly RENDERBUFFER_ALPHA_SIZE: number;
    readonly RENDERBUFFER_BINDING: number;
    readonly RENDERBUFFER_BLUE_SIZE: number;
    readonly RENDERBUFFER_DEPTH_SIZE: number;
    readonly RENDERBUFFER_GREEN_SIZE: number;
    readonly RENDERBUFFER_HEIGHT: number;
    readonly RENDERBUFFER_INTERNAL_FORMAT: number;
    readonly RENDERBUFFER_RED_SIZE: number;
    readonly RENDERBUFFER_STENCIL_SIZE: number;
    readonly RENDERBUFFER_WIDTH: number;
    readonly RENDERER: number;
    readonly REPEAT: number;
    readonly REPLACE: number;
    readonly RGB: number;
    readonly RGB565: number;
    readonly RGB5_A1: number;
    readonly RGBA: number;
    readonly RGBA4: number;
    readonly SAMPLER_2D: number;
    readonly SAMPLER_CUBE: number;
    readonly SAMPLES: number;
    readonly SAMPLE_ALPHA_TO_COVERAGE: number;
    readonly SAMPLE_BUFFERS: number;
    readonly SAMPLE_COVERAGE: number;
    readonly SAMPLE_COVERAGE_INVERT: number;
    readonly SAMPLE_COVERAGE_VALUE: number;
    readonly SCISSOR_BOX: number;
    readonly SCISSOR_TEST: number;
    readonly SHADER_TYPE: number;
    readonly SHADING_LANGUAGE_VERSION: number;
    readonly SHORT: number;
    readonly SRC_ALPHA: number;
    readonly SRC_ALPHA_SATURATE: number;
    readonly SRC_COLOR: number;
    readonly STATIC_DRAW: number;
    readonly STENCIL_ATTACHMENT: number;
    readonly STENCIL_BACK_FAIL: number;
    readonly STENCIL_BACK_FUNC: number;
    readonly STENCIL_BACK_PASS_DEPTH_FAIL: number;
    readonly STENCIL_BACK_PASS_DEPTH_PASS: number;
    readonly STENCIL_BACK_REF: number;
    readonly STENCIL_BACK_VALUE_MASK: number;
    readonly STENCIL_BACK_WRITEMASK: number;
    readonly STENCIL_BITS: number;
    readonly STENCIL_BUFFER_BIT: number;
    readonly STENCIL_CLEAR_VALUE: number;
    readonly STENCIL_FAIL: number;
    readonly STENCIL_FUNC: number;
    readonly STENCIL_INDEX: number;
    readonly STENCIL_INDEX8: number;
    readonly STENCIL_PASS_DEPTH_FAIL: number;
    readonly STENCIL_PASS_DEPTH_PASS: number;
    readonly STENCIL_REF: number;
    readonly STENCIL_TEST: number;
    readonly STENCIL_VALUE_MASK: number;
    readonly STENCIL_WRITEMASK: number;
    readonly STREAM_DRAW: number;
    readonly SUBPIXEL_BITS: number;
    readonly TEXTURE: number;
    readonly TEXTURE0: number;
    readonly TEXTURE1: number;
    readonly TEXTURE10: number;
    readonly TEXTURE11: number;
    readonly TEXTURE12: number;
    readonly TEXTURE13: number;
    readonly TEXTURE14: number;
    readonly TEXTURE15: number;
    readonly TEXTURE16: number;
    readonly TEXTURE17: number;
    readonly TEXTURE18: number;
    readonly TEXTURE19: number;
    readonly TEXTURE2: number;
    readonly TEXTURE20: number;
    readonly TEXTURE21: number;
    readonly TEXTURE22: number;
    readonly TEXTURE23: number;
    readonly TEXTURE24: number;
    readonly TEXTURE25: number;
    readonly TEXTURE26: number;
    readonly TEXTURE27: number;
    readonly TEXTURE28: number;
    readonly TEXTURE29: number;
    readonly TEXTURE3: number;
    readonly TEXTURE30: number;
    readonly TEXTURE31: number;
    readonly TEXTURE4: number;
    readonly TEXTURE5: number;
    readonly TEXTURE6: number;
    readonly TEXTURE7: number;
    readonly TEXTURE8: number;
    readonly TEXTURE9: number;
    readonly TEXTURE_2D: number;
    readonly TEXTURE_BINDING_2D: number;
    readonly TEXTURE_BINDING_CUBE_MAP: number;
    readonly TEXTURE_CUBE_MAP: number;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_X: number;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_Y: number;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_Z: number;
    readonly TEXTURE_CUBE_MAP_POSITIVE_X: number;
    readonly TEXTURE_CUBE_MAP_POSITIVE_Y: number;
    readonly TEXTURE_CUBE_MAP_POSITIVE_Z: number;
    readonly TEXTURE_MAG_FILTER: number;
    readonly TEXTURE_MIN_FILTER: number;
    readonly TEXTURE_WRAP_S: number;
    readonly TEXTURE_WRAP_T: number;
    readonly TRIANGLES: number;
    readonly TRIANGLE_FAN: number;
    readonly TRIANGLE_STRIP: number;
    readonly UNPACK_ALIGNMENT: number;
    readonly UNPACK_COLORSPACE_CONVERSION_WEBGL: number;
    readonly UNPACK_FLIP_Y_WEBGL: number;
    readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL: number;
    readonly UNSIGNED_BYTE: number;
    readonly UNSIGNED_INT: number;
    readonly UNSIGNED_SHORT: number;
    readonly UNSIGNED_SHORT_4_4_4_4: number;
    readonly UNSIGNED_SHORT_5_5_5_1: number;
    readonly UNSIGNED_SHORT_5_6_5: number;
    readonly VALIDATE_STATUS: number;
    readonly VENDOR: number;
    readonly VERSION: number;
    readonly VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: number;
    readonly VERTEX_ATTRIB_ARRAY_ENABLED: number;
    readonly VERTEX_ATTRIB_ARRAY_NORMALIZED: number;
    readonly VERTEX_ATTRIB_ARRAY_POINTER: number;
    readonly VERTEX_ATTRIB_ARRAY_SIZE: number;
    readonly VERTEX_ATTRIB_ARRAY_STRIDE: number;
    readonly VERTEX_ATTRIB_ARRAY_TYPE: number;
    readonly VERTEX_SHADER: number;
    readonly VIEWPORT: number;
    readonly ZERO: number;
};
