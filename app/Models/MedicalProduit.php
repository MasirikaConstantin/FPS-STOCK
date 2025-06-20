<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalProduit extends Model
{
    protected $table = 'medical_produits';

    protected $fillable = [
        'nom',
        'description',
        'prix',
        'quantite',
        'date_expiration',
        'ref',
        'created_by',
        'updated_by',
        'categorie_id',
        'sous_category',
        'unite',
        'fabricant',
        'fournisseur_id',
        'requires_refrigeration',
        'duree_vie',
        'seuil_min',
        'is_active',
        
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
