using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Models.Math
{
    public class Vector
    {
        public static readonly Vector Zero = new Vector( 0, 0 );

        public float X { get; set; }
        public float Y { get; set; }

        public Vector() { X = 0; Y = 0; }
        public Vector( float x ) { X = x; Y = x; }
        public Vector( float x, float y ) { X = x; Y = y; }

        public float Length() { return MathF.Sqrt( X * X + Y * Y ); }
        public Vector Normalize() { return Divide( Length() ); }
        public Vector Negate() { return new Vector( -X, -Y ); }
        public Vector Reciprocal() { return new Vector( 1 / X, 1 / Y ); }

        public Vector Add( float x ) { return new Vector( X + x, Y + x ); }
        public Vector Subtract( float x ) { return new Vector( X - x, Y - x ); }
        public Vector Multiply( float x ) { return new Vector( X * x, Y * x ); }
        public Vector Divide( float x ) { return new Vector( X / x, Y / x ); }

        public Vector Add( Vector x ) { return new Vector( X + x.X, Y + x.Y ); }
        public Vector Subtract( Vector x ) { return new Vector( X - x.X, Y - x.Y ); }
        public Vector Multiply( Vector x ) { return new Vector( X * x.X, Y * x.Y ); }
        public Vector Divide( Vector x ) { return new Vector( X / x.X, Y / x.Y ); }
    }
}
