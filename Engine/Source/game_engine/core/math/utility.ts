
export class FMath
{
    static readonly INV_PI: number = 1.0 / Math.PI;
    static readonly PI: number = Math.PI;
    static readonly HALF_PI: number = Math.PI / 2.0;

    //////////////////////////////////////////////////////////////////////////
    public static Floor( value: number ): number
    {
        return Math.floor( value );
    };

    //////////////////////////////////////////////////////////////////////////
    public static SinCos( value: number ): number[]
    {
        // Map Value to y in [-pi,pi], x = 2*pi*quotient + remainder.
        let quotient = ( FMath.INV_PI * 0.5 ) * value;
        if ( value >= 0.0 )
        {
            quotient = FMath.Floor( quotient + 0.5 );
        }
        else
        {
            quotient = FMath.Floor( quotient - 0.5 );
        }
        let y = value - ( 2.0 * FMath.PI ) * quotient;

        // Map y to [-pi/2,pi/2] with sin(y) = sin(Value).
        let sign: number;
        if ( y > FMath.HALF_PI )
        {
            y = FMath.PI - y;
            sign = -1.0;
        }
        else if ( y < -FMath.HALF_PI )
        {
            y = -FMath.PI - y;
            sign = -1.0;
        }
        else
        {
            sign = +1.0;
        }

        let y2 = y * y;

        // 11-degree minimax approximation
        let scalarSin = ( ( ( ( ( -2.3889859e-08 * y2 + 2.7525562e-06 ) * y2 - 0.00019840874 ) * y2 + 0.0083333310 ) * y2 - 0.16666667 ) * y2 + 1.0 ) * y;

        // 10-degree minimax approximation
        let p = ( ( ( ( -2.6051615e-07 * y2 + 2.4760495e-05 ) * y2 - 0.0013888378 ) * y2 + 0.041666638 ) * y2 - 0.5 ) * y2 + 1.0;
        let scalarCos = sign * p;

        return [scalarSin, scalarCos];
    };

    //////////////////////////////////////////////////////////////////////////
    public static DegreesToRadians( value: number ): number
    {
        return value * ( FMath.PI / 180.0 );
    };
};
