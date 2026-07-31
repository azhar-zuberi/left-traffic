// Never actually shown: the tab bar intercepts this tab's press and pushes the
// New Post modal instead (see (tabs)/_layout.tsx). This route file must exist
// for expo-router to register the tab.
export default function NewPostTabPlaceholder() {
  return null;
}
