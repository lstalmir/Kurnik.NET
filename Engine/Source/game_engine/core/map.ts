
export class CPair<K, T>
{
    public First: K;
    public Second: T;
    
    public constructor( first: K, second: T )
    {
        this.First = first;
        this.Second = second;
    };
};

export class CMap<K, T>
{
    protected mElements: CPair<K, T>[];
    protected mValues: T[];
    protected mKeys: K[];
    protected mDirty: boolean;

    //////////////////////////////////////////////////////////////////////////
    // @brief Create new association map.
    public constructor()
    {
        this.mElements = new Array<CPair<K, T>>();
        this.mDirty = true;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Store new value under specified key. If the map already 
    //  contains an element under the specified key, it will be replaced.
    // @param key [in] Location of the new value.
    // @param value [in] New value to store.
    public Put( key: K, value: T ): void
    {
        let elementFound = false;
        this.mElements.forEach(
            function ( v )
            {
                if ( v.First == key )
                {
                    v.Second = value;
                    elementFound = true;
                    return;
                }
            } )
        if ( !elementFound )
        {
            this.mElements.push( new CPair<K, T>( key, value ) );
        }
        this.mDirty = true;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get value stored under specified key.
    // @return Value associated with the key or null.
    public Get( key: K ): T
    {
        let value = null;
        this.mElements.forEach(
            function ( v )
            {
                if ( v.First == key )
                {
                    value = v.Second;
                    return;
                }
            } );
        return value;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get number of elements stored in the map.
    // @returns Number of map elements.
    public Size(): number
    {
        return this.mElements.length;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get list of values stored in the map.
    // @return List of values.
    public Values(): T[]
    {
        if ( this.mDirty )
            this.CacheKeysAndValues();
        return this.mValues;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get list of keys defined in the map.
    // @return List of keys.
    public Keys(): K[]
    {
        if ( this.mDirty )
            this.CacheKeysAndValues();
        return this.mKeys;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get list of key-value pairs.
    public Pairs(): CPair<K, T>[]
    {
        return this.mElements;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Remove entry from the map.
    // @param key [in] Key under which the value to remove is stored.
    public Remove( key: K ): void
    {
        let len = this.mElements.length;
        this.mElements =
            this.mElements.filter( function ( v ) { return v.First != key; } );
        if ( len != this.mElements.length )
            this.mDirty = true;
        return;
    };

    //////////////////////////////////////////////////////////////////////////
    protected CacheKeysAndValues(): void
    {
        this.mValues = new Array<T>();
        this.mKeys = new Array<K>();
        this.mElements.forEach(
            function ( this: CMap<K, T>, v )
            {
                this.mKeys.push( v.First );
                this.mValues.push( v.Second );
            },
            this );
        this.mDirty = false;
    };
};
