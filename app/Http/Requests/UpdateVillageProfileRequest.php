<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateVillageProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'total_population' => ['required', 'integer', 'min:0'],
            'total_families' => ['required', 'integer', 'min:0'],
            'total_hamlets' => ['required', 'integer', 'min:0'],
            'total_area_hectares' => ['required', 'integer', 'min:0'],
            'boundary_north' => ['required', 'string', 'max:255'],
            'boundary_east' => ['required', 'string', 'max:255'],
            'boundary_south' => ['required', 'string', 'max:255'],
            'boundary_west' => ['required', 'string', 'max:255'],
            'hamlets' => ['nullable', 'array'],
            'hamlets.*.name' => ['required', 'string', 'max:255'],
            'hamlets.*.rw_count' => ['required', 'integer', 'min:0'],
            'hamlets.*.rt_count' => ['required', 'integer', 'min:0'],
            'hamlets.*.kk_count' => ['required', 'integer', 'min:0'],
            'hamlets.*.description' => ['nullable', 'string', 'max:500'],
            'land_use' => ['nullable', 'array'],
            'land_use.*.category' => ['required', 'string', 'max:255'],
            'land_use.*.area_hectares' => ['required', 'numeric', 'min:0'],
            'land_use.*.percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'demographics' => ['nullable', 'array'],
            'map_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'map_longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'map_zoom' => ['nullable', 'integer', 'min:1', 'max:20'],
            'map_google_url' => ['nullable', 'url', 'max:1000'],
            'map_hd_file_url' => ['nullable', 'url', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'total_population.required' => 'Total penduduk wajib diisi.',
            'total_population.integer' => 'Total penduduk harus berupa angka.',
            'total_population.min' => 'Total penduduk tidak boleh negatif.',
            'total_families.required' => 'Jumlah KK wajib diisi.',
            'total_families.integer' => 'Jumlah KK harus berupa angka.',
            'total_families.min' => 'Jumlah KK tidak boleh negatif.',
            'total_hamlets.required' => 'Jumlah dusun wajib diisi.',
            'total_hamlets.integer' => 'Jumlah dusun harus berupa angka.',
            'total_hamlets.min' => 'Jumlah dusun tidak boleh negatif.',
            'total_area_hectares.required' => 'Luas wilayah wajib diisi.',
            'total_area_hectares.integer' => 'Luas wilayah harus berupa angka.',
            'total_area_hectares.min' => 'Luas wilayah tidak boleh negatif.',
            'boundary_north.required' => 'Batas utara wajib diisi.',
            'boundary_east.required' => 'Batas timur wajib diisi.',
            'boundary_south.required' => 'Batas selatan wajib diisi.',
            'boundary_west.required' => 'Batas barat wajib diisi.',
            'hamlets.*.name.required' => 'Nama dusun wajib diisi.',
            'hamlets.*.rw_count.required' => 'Jumlah RW wajib diisi.',
            'hamlets.*.rt_count.required' => 'Jumlah RT wajib diisi.',
            'hamlets.*.kk_count.required' => 'Jumlah KK wajib diisi.',
            'land_use.*.category.required' => 'Kategori penggunaan lahan wajib diisi.',
            'land_use.*.area_hectares.required' => 'Luas area wajib diisi.',
            'land_use.*.percentage.required' => 'Persentase wajib diisi.',
            'land_use.*.percentage.max' => 'Persentase tidak boleh lebih dari 100%.',
            'map_latitude.between' => 'Latitude harus antara -90 sampai 90.',
            'map_longitude.between' => 'Longitude harus antara -180 sampai 180.',
            'map_zoom.min' => 'Zoom minimal 1.',
            'map_zoom.max' => 'Zoom maksimal 20.',
            'map_google_url.url' => 'URL Google Maps harus berupa URL yang valid.',
            'map_hd_file_url.url' => 'URL file peta HD harus berupa URL yang valid.',
        ];
    }
}
