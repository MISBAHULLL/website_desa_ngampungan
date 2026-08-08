<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'media_type' => ['required', Rule::in(['photo', 'video'])],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content' => ['required', 'array', 'min:1'],
            'content.*' => ['required', 'string', 'max:10000'],
            'author' => ['nullable', 'string', 'max:100'],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:3072',
            ],
            'image_url' => ['nullable', 'url:http,https', 'max:500'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'video' => [
                'nullable',
                'file',
                'mimes:mp4,webm,avi,mov',
                'mimetypes:video/mp4,video/webm,video/x-msvideo,video/quicktime',
                'max:102400', // 100MB
            ],
            'video_url' => ['nullable', 'url:http,https', 'max:500'],
            'remove_video' => ['nullable', 'boolean'],
            'remove_image' => ['nullable', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'category.required' => 'Pilih kategori atau isi kategori lainnya.',
            'image.image' => 'File yang dipilih harus berupa gambar.',
            'image.mimes' => 'Gambar harus berformat JPG, JPEG, PNG, atau WebP.',
            'image.mimetypes' => 'Isi file tidak sesuai dengan format gambar yang didukung.',
            'image.max' => 'Ukuran gambar maksimal 3 MB.',
            'image_url.url' => 'URL gambar harus berupa alamat HTTP atau HTTPS yang valid.',
            'video.file' => 'File yang dipilih harus berupa video.',
            'video.mimes' => 'Video harus berformat MP4, WebM, AVI, atau MOV.',
            'video.mimetypes' => 'Isi file tidak sesuai dengan format video yang didukung.',
            'video.max' => 'Ukuran video maksimal 100 MB.',
            'video_url.url' => 'URL video harus berupa alamat HTTP atau HTTPS yang valid.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $mediaType = $this->string('media_type')->toString();

        if ($mediaType === '') {
            $mediaType = $this->hasFile('video') || $this->filled('video_url')
                ? 'video'
                : 'photo';
        }

        $this->merge([
            'category' => Str::squish($this->string('category')->toString()),
            'media_type' => $mediaType,
        ]);
    }
}
