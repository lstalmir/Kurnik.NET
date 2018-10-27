
export class FRotator
{
    public Value: number;

    public constructor( value: number = 0 )
    {
        this.Value = value;
    };

    public Set( rotator: FRotator ): void
    {
        this.Value = rotator.Value;
    };


};
