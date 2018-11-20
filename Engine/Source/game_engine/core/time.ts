
class FAsyncTask
{
    constructor( private invocable: Function, private args: any[] )
    { };

    public Invoke(): void
    {
        this.invocable.apply( this.args );
    };
};

export class FAsyncTaskQueue
{
    protected mTaskQueue: FAsyncTask[];
    protected mExecuteAsyncInterval: number;

    public constructor()
    {
        this.mTaskQueue = new Array<FAsyncTask>();
        this.mExecuteAsyncInterval = 0;
    };

    public SubmitTask( invocable: Function, ...args: any[] ): void
    {
        this.mTaskQueue.push( new FAsyncTask( invocable, args ) );
    };

    public SetExecuteAsyncInterval( interval: number ): void
    {
        this.mExecuteAsyncInterval = interval;
    };

    public ExecuteAsync(): void
    {
        let interval = this.mExecuteAsyncInterval;
        for ( let task of this.mTaskQueue )
        {
            setTimeout( function () { task.Invoke() }, 1000 * interval );
            interval += this.mExecuteAsyncInterval;
        }
    };

    public Execute(): void
    {
        for ( let task of this.mTaskQueue )
            task.Invoke();
    };
};
