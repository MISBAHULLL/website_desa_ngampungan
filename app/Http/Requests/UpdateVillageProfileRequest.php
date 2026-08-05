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
            'totalPopulation' => ['required', 'integer', 'min:0'],
            'totalFamilies' => ['required', 'integer', 'min:0'],
            'totalHamlets' => ['required', 'integer', 'min:0'],
            'totalAreaHectares' => ['required', 'integer', 'min:0'],
            'boundaryNorth' => ['required', 'string', 'max:255'],
            'boundaryEast' => ['required', 'string', 'max:255'],
            'boundarySouth' => ['required', 'string', 'max:255'],
            'boundaryWest' => ['required', 'string', 'max:255'],
            'hamlets' => ['nullable', 'array'],
            'hamlets.*.name' => ['required', 'string', 'max:255'],
            'hamlets.*.rw_count' => ['required', 'integer', 'min:0'],
            'hamlets.*.rt_count' => ['required', 'integer', 'min:0'],
            'hamlets.*.kk_count' => ['required', 'integer', 'min:0'],
            'hamlets.*.description' => ['nullable', 'string', 'max:500'],
            'landUse' => ['nullable', 'array'],
            'landUse.*.category' => ['required', 'string', 'max:255'],
            'landUse.*.area_hectares' => ['required', 'numeric', 'min:0'],
            'landUse.*.percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'demographics' => ['nullable', 'array'],
            'mapLatitude' => ['nullable', 'numeric', 'between:-90,90'],
            'mapLongitude' => ['nullable', 'numeric', 'between:-180,180'],
            'mapZoom' => ['nullable', 'integer', 'min:1', 'max:20'],
            'mapGoogleUrl' => ['nullable', 'url', 'max:1000'],
            'mapHdFileUrl' => ['nullable', 'url', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'totalPopulation.required' => 'Total penduduk wajib diisi.',
            'totalPopulation.integer' => 'Total penduduk harus berupa angka.',
            'totalPopulation.min' => 'Total penduduk tidak boleh negatif.',
            'totalFamilies.required' => 'Jumlah KK wajib diisi.',
            'totalFamilies.integer' => 'Jumlah KK harus berupa angka.',
            'totalFamilies.min' => 'Jumlah KK tidak boleh negatif.',
            'totalHamlets.required' => 'Jumlah dusun wajib diisi.',
            'totalHamlets.integer' => 'Jumlah dusun harus berupa angka.',
            'totalHamlets.min' => 'Jumlah dusun tidak boleh negatif.',
            'totalAreaHectares.required' => 'Luas wilayah wajib diisi.',
            'totalAreaHectares.integer' => 'Luas wilayah harus berupa angka.',
            'totalAreaHectares.min' => 'Luas wilayah tidak boleh negatif.',
            'boundaryNorth.required' => 'Batas utara wajib diisi.',
            'boundaryEast.required' => 'Batas timur wajib diisi.',
            'boundarySouth.required' => 'Batas selatan wajib diisi.',
            'boundaryWest.required' => 'Batas barat wajib diisi.',
            'hamlets.*.name.required' => 'Nama dusun wajib diisi.',
            'hamlets.*.rw_count.required' => 'Jumlah RW wajib diisi.',
            'hamlets.*.rt_count.required' => 'Jumlah RT wajib diisi.',
            'hamlets.*.kk_count.required' => 'Jumlah KK wajib diisi.',
            'landUse.*.category.required' => 'Kategori penggunaan lahan wajib diisi.',
            'landUse.*.area_hectares.required' => 'Luas area wajib diisi.',
            'landUse.*.percentage.required' => 'Persentase wajib diisi.',
            'landUse.*.percentage.max' => 'Persentase tidak boleh lebih dari 100%.',
            'mapLatitude.between' => 'Latitude harus antara -90 sampai 90.',
            'mapLongitude.between' => 'Longitude harus antara -180 sampai 180.',
            'mapZoom.min' => 'Zoom minimal 1.',
            'mapZoom.max' => 'Zoom maksimal 20.',
            'mapGoogleUrl.url' => 'URL Google Maps harus berupa URL yang valid.',
            'mapHdFileUrl.url' => 'URL file peta HD harus berupa URL yang valid.',
        ];
    }
}
