/**
 * Anti-flicker script for Safari.
 *
 * Hides the page immediately, then reveals it after two animation frames
 * (enough time for CSS to apply and Framer Motion to hydrate).
 * This prevents the FOUC (Flash of Unstyled Content) that Safari shows
 * when client-side JS modifies element styles on hydration.
 *
 * The script content is a static string literal with no user input.
 */
export default function AntiFlicker() {
  const safeStaticScript = [
    "(function(){",
    "var d=document.documentElement;",
    "d.style.opacity='0';",
    "requestAnimationFrame(function(){",
    "requestAnimationFrame(function(){",
    "d.style.transition='opacity 0.25s ease-out';",
    "d.style.opacity='1';",
    "});",
    "});",
    "})();",
  ].join("");

  // eslint-disable-next-line react/no-danger -- static script, no user input
  return <script dangerouslySetInnerHTML={{ __html: safeStaticScript }} />;
}
