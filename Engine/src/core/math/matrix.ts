
export class FMatrix
{
    public M: number[];


    //////////////////////////////////////////////////////////////////////////
    constructor()
    {
        this.M = new Array<number>( 16 );

        // Create identity matrix by default.
        this.M[0] = 1;      this.M[1] = 0;      this.M[2] = 0;      this.M[3] = 0;
        this.M[4] = 0;      this.M[5] = 1;      this.M[6] = 0;      this.M[7] = 0;
        this.M[8] = 0;      this.M[9] = 0;      this.M[10] = 1;     this.M[11] = 0;
        this.M[12] = 0;     this.M[13] = 0;     this.M[14] = 0;     this.M[15] = 1;
    };
};
