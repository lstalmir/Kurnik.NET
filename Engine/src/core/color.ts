
export enum EColor
{
    Black,
    White,
    Red
};

export class FColor
{
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    //////////////////////////////////////////////////////////////////////////
    constructor( r: number, g: number, b: number, a: number = 1 )
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    };

    //////////////////////////////////////////////////////////////////////////
    static Get(
        color: EColor
    ): FColor
    {
        switch ( color )
        {
            case EColor.Black: return new FColor( 0, 0, 0 );
            case EColor.White: return new FColor( 1, 1, 1 );
            case EColor.Red: return new FColor( 1, 0, 0 );
        }
        throw Error( "GetColor: Invalid color specified" );
    };
};
