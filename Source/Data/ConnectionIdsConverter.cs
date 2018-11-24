using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Data
{
    public class ConnectionIdsConverter
    {
        public string ToDbColumn(ISet<string> connectionIds)
        {
            return string.Join(";", connectionIds);
        }

        public ISet<string> ToEntityAttribute(string connectionIdsString)
        {
            if(connectionIdsString == null || connectionIdsString.Length == 0)
            {
                return new HashSet<string>();
            }
            var connectionsArr = connectionIdsString.Split(";");
            return new HashSet<string>(connectionsArr);
        }
    }
}
