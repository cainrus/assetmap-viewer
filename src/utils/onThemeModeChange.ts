export default function (callback: (theme: string) => void) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        callback(e.matches ? "dark" : "light");
    });
}