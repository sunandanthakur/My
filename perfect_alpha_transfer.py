from PIL import Image
import numpy as np

img_N = Image.open('/Users/sunandanthakur/.gemini/antigravity/brain/7afeeee0-6a0f-4a9b-a8af-7571b04d82dd/media__1774612368224.png').convert('RGBA')
img_P = Image.open('/Users/sunandanthakur/.gemini/antigravity/brain/7afeeee0-6a0f-4a9b-a8af-7571b04d82dd/media__1774612374197.jpg').convert('RGB')

def get_body_bbox(img_arr, is_black_bg):
    if is_black_bg:
        mask = (img_arr[:,:,0] > 20) | (img_arr[:,:,1] > 20) | (img_arr[:,:,2] > 20)
    else:
        mask = img_arr[:,:,3] > 20
    y_coords, x_coords = np.where(mask)
    if len(y_coords) == 0: return img_arr.shape[1]//2, img_arr.shape[0]//2
    return int(np.mean(x_coords)), int(np.mean(y_coords))

def get_width(img_arr, is_black_bg):
    if is_black_bg:
        mask = (img_arr[:,:,0] > 20) | (img_arr[:,:,1] > 20) | (img_arr[:,:,2] > 20)
    else:
        mask = img_arr[:,:,3] > 20
    _, x_coords = np.where(mask)
    if len(x_coords) == 0: return 1
    return np.max(x_coords) - np.min(x_coords)

cx_N, cy_N = get_body_bbox(np.array(img_N), False)
cx_P, cy_P = get_body_bbox(np.array(img_P), True)

w_N = get_width(np.array(img_N), False)
w_P = get_width(np.array(img_P), True)

ratio = w_N / w_P
img_P_resized = img_P.resize((int(img_P.width * ratio), int(img_P.height * ratio)), Image.Resampling.LANCZOS)
cx_P_res = int(cx_P * ratio)
cy_P_res = int(cy_P * ratio)

canvas = Image.new('RGB', img_N.size, (0,0,0))
offset_x = cx_N - cx_P_res
offset_y = cy_N - cy_P_res
canvas.paste(img_P_resized, (offset_x, offset_y))

arr_P_mapped = np.array(canvas)
arr_N = np.array(img_N)

# The paint strokes exist in arr_P_mapped. But we only want pixels where arr_N is not transparent!
# Wait! If the paint strokes EXTEND OUTSIDE the normal butterfly's wings, they will be CUT OFF by arr_N's alpha!
# That is exactly what we want, because the user complained about the jagged masked background.
# Clipping it exactly to the normal butterfly's pristine alpha channel guarantees PERFECT edges.
final_P_rgba = np.dstack((arr_P_mapped, arr_N[:,:,3]))

final_P_img = Image.fromarray(final_P_rgba)

final_P_img.save('assets/butterfly_painted.png')
img_N.save('assets/butterfly_normal.png')
print("Successfully saved assets/butterfly_painted.png and assets/butterfly_normal.png")
