<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalProduit extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
    protected $table = 'medical_produits';

    protected $fillable = [
        'name',
        'description',
        'prix_unitaire',
        'quantite',
        'date_expiration',
        'ref',
        'created_by',
        'updated_by',
        'categorie_id',
        'sous_category',
        'unite',
        'fabrican',
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
    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
}
