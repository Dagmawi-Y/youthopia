import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Picker
      data={data}
      onEmojiSelect={onEmojiSelect}
      categories={[
        "frequent",
        "people",
        "nature",
        "foods",
        "activity",
        "places",
        "objects",
        "symbols",
      ]}
      exceptEmojis={[
        "middle_finger",
        "fu",
        "hankey",
        "poop",
        "shit",
        "skull",
        "skull_and_crossbones",
        "smoking",
        "cigarette",
        "knife",
        "gun",
        "bomb",
        "man-kiss-man",
        "woman-kiss-woman",
        "man-heart-man",
        "woman-heart-woman",
        "man-man-boy",
        "man-man-boy-boy",
        "man-man-girl",
        "man-man-girl-boy",
        "man-man-girl-girl",
        "woman-woman-boy",
        "woman-woman-boy-boy",
        "woman-woman-girl",
        "woman-woman-girl-boy",
        "woman-woman-girl-girl",
        "couplekiss",
        "family",
      ]}
    />
  );
}
