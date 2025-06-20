<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleKit extends Model
{
    protected $table = 'article_kits';

    protected $fillable = [
        'kit_id',
        'medical_produit_id',
        'quantite',
        'created_by',
        'updated_by',
        'ref',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }

    public function kit()
    {
        return $this->belongsTo(Kit::class);
    }

    public function medicalProduit()
    {
        return $this->belongsTo(MedicalProduit::class);
    }
}
