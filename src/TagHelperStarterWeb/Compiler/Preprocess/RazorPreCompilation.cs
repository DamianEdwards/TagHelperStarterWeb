using System;
using Microsoft.AspNet.Mvc;

namespace TagHelperStarterWeb.Compiler.Preprocess
{
    public class RazorPreCompilation : RazorPreCompileModule
    {
        public RazorPreCompilation(IServiceProvider provider) : base(provider)
        {

        }
    }
}
