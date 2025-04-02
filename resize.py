import os
from PIL import Image

def resize_and_edit_images(input_folder, output_folder, scale_factor=0.1):
    """
    指定されたフォルダ内のすべての画像をリサイズし、背景を透明化、白色以外をantiquewhiteに変更して、別のフォルダに保存します。

    Args:
        input_folder: 画像が格納されている入力フォルダのパス。
        output_folder: リサイズされた画像を保存する出力フォルダのパス。
        scale_factor: リサイズするスケールファクター（例：0.1は1/10サイズ）。
    """

    # 出力フォルダが存在しない場合は作成
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # 入力フォルダ内のすべてのファイルを取得
    for filename in os.listdir(input_folder):
        # ファイルのフルパスを作成
        input_filepath = os.path.join(input_folder, filename)

        # ファイルが画像かどうかを確認 (拡張子で判断)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
            try:
                # 画像を開く
                img = Image.open(input_filepath).convert("RGBA")  # RGBAモードで開く

                # 元の画像のサイズを取得
                width, height = img.size

                # 新しいサイズを計算
                new_width = int(width * scale_factor)
                new_height = int(height * scale_factor)

                # 画像をリサイズ
                resized_img = img.resize((new_width, new_height))

                # ピクセルデータを取得
                pixels = resized_img.load()

                # 画像のピクセルデータを編集
                for y in range(resized_img.height):
                    for x in range(resized_img.width):
                        r, g, b, a = pixels[x, y]

                        if a != 0:  # 透明でない場合
                            if not (r > 240 and g > 240 and b > 240):  # 白色でない場合
                                pixels[x, y] = (250, 235, 215, a)  # antiquewhiteに変更
                            else:
                                pixels[x, y] = (r, g, b, 0) #白を透明にする
                        
                # 出力ファイルのパスを作成
                output_filepath = os.path.join(output_folder, filename)

                # リサイズされた画像を保存
                resized_img.save(output_filepath)

                print(f"リサイズと編集完了: {filename} -> {output_filepath}")

            except Exception as e:
                print(f"エラー: {filename} の処理中にエラーが発生しました: {e}")
        else:
            print(f"スキップ: {filename} は画像ファイルではありません。")

# 使用例
input_folder = "hiragana_git\\hiragana\\pic"  # 画像が格納されているフォルダ
output_folder = "hiragana_git\\hiragana\\pic_small2"  # リサイズされた画像を保存するフォルダ
resize_and_edit_images(input_folder, output_folder)
