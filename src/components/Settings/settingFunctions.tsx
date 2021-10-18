export function toggleDarkMode(theme: string): void {
  console.log('test');

  switch (theme) {
    case "dark": {
      console.log(theme);
      break;
    }
    case "light": {
      console.log('loght');
      break;
    }
  }
}
