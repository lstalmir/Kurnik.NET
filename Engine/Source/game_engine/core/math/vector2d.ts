
export class FVector2D
{
    public x: number;
    public y: number;

    //////////////////////////////////////////////////////////////////////////
    // @brief Construct new 2D vector instance.
    // @param x [in] Optional x-axis vector component.
    // @param y [in] Optional y-axis vector component.
    constructor( x: number = 0, y: number = 0 )
    {
        this.x = x;
        this.y = y;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set new vector components.
    // @param vec [in] New vector components.
    public Set( vec: FVector2D ): void
    {
        this.x = vec.x;
        this.y = vec.y;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Compue length of the 2D vector.
    // @return Vector length (square root of sum of squared components).
    public Lenght(): number
    {
        return Math.sqrt( this.x * this.x + this.y * this.y );
    };
    
    //////////////////////////////////////////////////////////////////////////
    // @brief Get sum of two vectors (as a third vector instance).
    // @param other [in] The second component of the sum.
    // @return New vector instance with components being sum of the current
    //  vector and the other one.
    public Add( other: number | FVector2D ): FVector2D
    {
        if ( other instanceof FVector2D )
        { // vector + vector
            return new FVector2D( this.x + other.x, this.y + other.y );
        }
        else
        { // vector + scalar
            return new FVector2D( this.x + other, this.y + other );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Subtract from each vector component.
    // @param other [in] The second component of the difference.
    // @return New vector instance with components being difference between
    //  the current vector and the other one.
    public Subtract( other: number | FVector2D ): FVector2D
    {
        if ( other instanceof FVector2D )
        { // vector - vector
            return new FVector2D( this.x - other.x, this.y - other.y );
        }
        else
        { // vector - scalar
            return new FVector2D( this.x - other, this.y - other );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get the vector scaled.
    // @param scale [in] The scale to apply on the current vector.
    // @return New vector instance with components being scaled.
    public Multiply( scale: number | FVector2D ): FVector2D
    {
        if ( scale instanceof FVector2D )
        { // vector * vector
            return new FVector2D( this.x * scale.x, this.y * scale.y );
        }
        else
        { // vector * scalar
            return new FVector2D( this.x * scale, this.y * scale );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get the vector divided.
    // @param scale [in] The value to divide the vector with.
    // @return New vector instance with components divided.
    public Divide( scale: number | FVector2D ): FVector2D
    {
        if ( scale instanceof FVector2D )
        { // vector / vector
            return new FVector2D( this.x / scale.x, this.y / scale.y );
        }
        else
        { // vector / scalar
            return new FVector2D( this.x / scale, this.y / scale );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Perform fused multiply-add operation on the vector.
    // @param other1 [in] The scale.
    // @param other2 [in] The component.
    // @return New vector being the result of a*b+c operation.
    public MultiplyAdd( other1: number | FVector2D, other2: number | FVector2D ): FVector2D
    {
        // Invoke constructor once
        var newVector = new FVector2D( this.x, this.y );
        
        if ( other1 instanceof FVector2D )
        { // vector * vector
            newVector.x *= other1.x;
            newVector.y *= other1.y;
        }
        else
        { // vector * scalar
            newVector.x *= other1;
            newVector.y *= other1;
        }

        if ( other2 instanceof FVector2D )
        { // vector + vector
            newVector.x += other2.x;
            newVector.y += other2.y;
        }
        else
        { // vector + scalar
            newVector.x += other2;
            newVector.y += other2;
        }
        
        return newVector;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Check if two vectors are equal (within some tolerance).
    // @param other [in] The second vector.
    // @param tolerance [in] Tolerance within which vectors may differ to be
    //  considered equal.
    // @return True, if vectors are (nearly) equal, false otherwise.
    public Equals( other: FVector2D, tolerance: number = 1e-5 ): boolean
    {
        return Math.abs( this.x - other.x ) < tolerance
            && Math.abs( this.y - other.y ) < tolerance;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Check if two vectors are not equal (within some tolerance).
    // @param other [in] The second vector.
    // @param tolerance [in] Tolerance within which vectors must not differ
    //  to be considered not equal.
    // @return True, if vectors are not (nearly) equal, false otherwise.
    public NotEquals( other: FVector2D, tolerance: number = 1e-5 ): boolean
    {
        return Math.abs( this.x - other.x ) >= tolerance
            && Math.abs( this.y - other.y ) >= tolerance;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Invert the vector components (1/x).
    // @return New vector instance with inverted components.
    public Invert(): FVector2D
    {
        return new FVector2D( 1 / this.x, 1 / this.y );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Negate the vector components (-x).
    // @return New vector instance with negated components.
    public Negate(): FVector2D
    {
        return new FVector2D( -this.x, -this.y );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Normalize the vector. The normalization divides all components
    //  of the vector by its lenght, so that resulting vector's length is 1.
    // @return New normalized vector instance.
    public Normalize(): FVector2D
    {
        var lenght = this.Lenght();
        return new FVector2D( this.x / length, this.y / length );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get the maximum value of the vector's components.
    // @return The maximum vector component value.
    public GetMax(): number
    {
        return Math.max( this.x, this.y );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get the maximum value of the vector's components absolute 
    //  values.
    // @return The maximum vector component absolute value.
    public GetMaxAbs(): number
    {
        return Math.max( Math.abs( this.x ), Math.abs( this.y ) );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get the minimum value of the vector's components.
    // @return The minimum vector component value.
    public GetMin(): number
    {
        return Math.min( this.x, this.y );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get the minimum value of the vector's components absolute 
    //  values.
    // @return The minimum vector component absolute value.
    public GetMinAbs(): number
    {
        return Math.min( Math.abs( this.x ), Math.abs( this.y ) );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Check if vector is nearly zero vector.
    // @return True if vector is nearly zero vector, false otherwise.
    public IsNearlyZero( tolerance: number = 1e-5 ): boolean
    {
        return Math.abs( this.x ) < tolerance
            && Math.abs( this.y ) < tolerance;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Check if vector is exactly zero vector.
    // @return True if vector is exactly zero vector, false otherwise.
    public IsZero(): boolean
    {
        return this.x == 0 && this.y == 0;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Check if all components of the vector are finite values. If any
    //  of the components is NaN (Not a Number) or Inf (infinity), the
    //  function will return false.
    // @return True, if all components are valid, finite values.
    public IsFinite(): boolean
    {
        return isFinite( this.x ) && isFinite( this.y );
    };
};
