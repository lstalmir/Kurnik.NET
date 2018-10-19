import { FVector } from "../core/math/vector";
import { FVector2D } from "../core/math/vector2d";
import { CContext } from "../rendering/context";
import { EAttribute } from "../rendering/program";

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
    public static EnableInputLayout( context: CContext ): void
    {
        var gl = context.GetGLContext();
        var program = context.GetProgram();

        var pos_idx = program.GetAttributeLocation( EAttribute.Position );
        gl.vertexAttribPointer( pos_idx, 3, gl.FLOAT, false, FVertex.Size(), 0 );
        gl.enableVertexAttribArray( pos_idx );

        var tex_idx = program.GetAttributeLocation( EAttribute.Texcoord );
        gl.vertexAttribPointer( tex_idx, 2, gl.FLOAT, false, FVertex.Size(), 12 );
        gl.enableVertexAttribArray( program.GetAttributeLocation( EAttribute.Texcoord ) );
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
