import { FVector } from "../core/math/vector";
import { FVector2D } from "../core/math/vector2d";
import { CContext } from "../rendering/context";
import { EAttribute } from "../rendering/program";

export class FInstancedVertexAttribute
{
    public Position: FVector;
    public Texcoord: FVector2D;

    //////////////////////////////////////////////////////////////////////////
    public constructor(
        pos_x: number,
        pos_y: number,
        pos_z: number,
        tex_u: number,
        tex_v: number )
    {
        this.Position = new FVector( pos_x, pos_y, pos_z );
        this.Texcoord = new FVector2D( tex_u, tex_v );
    };

    //////////////////////////////////////////////////////////////////////////
    public static Size(): number
    {
        return 20;
    };

    //////////////////////////////////////////////////////////////////////////
    public static EnableInputLayout( context: CContext, buffer: WebGLBuffer )
    {
        let gl2 = context.GetGL2Context();
        var program = context.GetProgram();

        if ( gl2 == null )
            throw Error( "FInstancedVertexAttribute: Instancing is not supported" );
        
        var instancePositionAttribute = program.GetAttributeLocation( EAttribute.InstancePosition );
        var instanceTexcoordAttribute = program.GetAttributeLocation( EAttribute.InstanceTexcoord );

        gl2.enableVertexAttribArray( instancePositionAttribute );
        gl2.enableVertexAttribArray( instanceTexcoordAttribute );

        gl2.bindBuffer( gl2.ARRAY_BUFFER, buffer );
        gl2.vertexAttribPointer( instancePositionAttribute, 3, gl2.FLOAT, false, FInstancedVertexAttribute.Size(), 0 );
        gl2.vertexAttribPointer( instanceTexcoordAttribute, 2, gl2.FLOAT, false, FInstancedVertexAttribute.Size(), 12 );
        gl2.vertexAttribDivisor( instancePositionAttribute, 1 );
        gl2.vertexAttribDivisor( instanceTexcoordAttribute, 1 );
    };

    //////////////////////////////////////////////////////////////////////////
    public static DisableInputLayout( context: CContext )
    {
        let gl2 = context.GetGL2Context();
        var program = context.GetProgram();

        if ( gl2 == null )
            throw Error( "FInstancedVertexAttribute: Instancing is not supported" );

        gl2.disableVertexAttribArray( program.GetAttributeLocation( EAttribute.InstancePosition ) );
        gl2.disableVertexAttribArray( program.GetAttributeLocation( EAttribute.InstanceTexcoord ) );
    };
};

export class FVertex
{
    public Position: FVector;
    public Texcoord: FVector2D;

    //////////////////////////////////////////////////////////////////////////
    public constructor(
        pos_x: number,
        pos_y: number,
        pos_z: number,
        tex_u: number,
        tex_v: number )
    {
        this.Position = new FVector( pos_x, pos_y, pos_z );
        this.Texcoord = new FVector2D( tex_u, tex_v );
    };

    //////////////////////////////////////////////////////////////////////////
    public GetData(): number[]
    {
        return new Array<number>(
            this.Position.x,
            this.Position.y,
            this.Position.z,
            this.Texcoord.x,
            this.Texcoord.y );
    };

    //////////////////////////////////////////////////////////////////////////
    public static Size(): number
    {
        return 20;
    };

    //////////////////////////////////////////////////////////////////////////
    public static EnableInputLayout( context: CContext, buffer: WebGLBuffer ): void
    {
        var gl = context.GetGLContext();
        var program = context.GetProgram();

        var positionAttribute = program.GetAttributeLocation( EAttribute.Position );
        var texcoordAttribute = program.GetAttributeLocation( EAttribute.Texcoord );

        gl.enableVertexAttribArray( positionAttribute );
        gl.enableVertexAttribArray( texcoordAttribute );

        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.vertexAttribPointer( positionAttribute, 3, gl.FLOAT, false, FVertex.Size(), 0 );
        gl.vertexAttribPointer( texcoordAttribute, 2, gl.FLOAT, false, FVertex.Size(), 12 );
    };

    //////////////////////////////////////////////////////////////////////////
    public static DisableInputLayout( context: CContext ): void
    {
        var gl = context.GetGLContext();
        var program = context.GetProgram();

        gl.disableVertexAttribArray( program.GetAttributeLocation( EAttribute.Position ) );
        gl.disableVertexAttribArray( program.GetAttributeLocation( EAttribute.Texcoord ) );
    };
};
