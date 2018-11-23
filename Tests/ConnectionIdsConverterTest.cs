using Kurnik.Data;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Kurnik.Tests
{
    public class ConnectionIdsConverter_ToDbColumnShould
    {
        [Fact]
        public void ReturnEmptyStringGivenEmptySet()
        {
            var set = new HashSet<string>();
            var converter = new ConnectionIdsConverter();

            var result = converter.ToDbColumn(set);

            Assert.Equal("", result);
        }

        [Fact]
        public void ReturnStringWithoutSeparatorGivenSingletonSet()
        {
            var set = new HashSet<string>() { "test"};
            var converter = new ConnectionIdsConverter();

            var result = converter.ToDbColumn(set);

            Assert.Equal("test", result);
        }

        [Fact]
        public void ReturnSeparatedValuesGivenSetWithMultipleValues()
        {
            var set = new HashSet<string>() { "test1", "test2" };
            var converter = new ConnectionIdsConverter();

            var result = converter.ToDbColumn(set);

            Assert.Equal("test1;test2", result);
        }
    }

    public class ConnectionIdsConverter_ToEntityAttributeShould
    {
        [Fact]
        public void ReturnEmptySetGivenEmptyString()
        {
            var str = "";
            var converter = new ConnectionIdsConverter();

            var result = converter.ToEntityAttribute(str);

            Assert.Equal(new HashSet<string>(), result);
        }

        [Fact]
        public void ReturnSingletonSetGivenStringWithoutSeparators()
        {
            var str = "test";
            var converter = new ConnectionIdsConverter();

            var result = converter.ToEntityAttribute(str);

            Assert.Equal(new HashSet<string> { "test"}, result);
        }

        [Fact]
        public void ReturnSetWithMultipleValuesGivenStringWithMultipleValuesSeparated()
        {
            var str = "test1;test2";
            var converter = new ConnectionIdsConverter();

            var result = converter.ToEntityAttribute(str);

            Assert.Equal(new HashSet<string> { "test1", "test2" }, result);
        }
    }
}
