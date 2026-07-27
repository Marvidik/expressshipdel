"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ChatScript() {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname || pathname.startsWith("/eshipcont")) {
            return;
        }

        const existingScript = document.getElementById("smartsupp-script");
        if (existingScript) {
            return;
        }

        const script = document.createElement("script");
        script.id = "smartsupp-script";
        script.type = "text/javascript";
        script.async = true;
        script.charset = "utf-8";
        script.src = "https://www.smartsuppchat.com/loader.js?";

        const inline = document.createElement("script");
        inline.type = "text/javascript";
        inline.textContent = `
      var _smartsupp = _smartsupp || {};
      _smartsupp.key = '8f7e8955592fcc81c936f3884c99c133f8203489';
      window.smartsupp||(function(d){
        var s,c,o=smartsupp=function(){o._.push(arguments)};o._=[];
        s=d.getElementsByTagName('script')[0];c=d.createElement('script');
        c.type='text/javascript';c.charset='utf-8';c.async=true;
        c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
      })(document);
    `;

        document.body.appendChild(inline);
        document.body.appendChild(script);
    }, [pathname]);

    return null;
}
