<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VillagePotentialOffering extends Model
{
    protected $guarded = ['id'];

    public function villagePotential()
    {
        return $this->belongsTo(VillagePotential::class);
    }
}
