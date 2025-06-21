<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Kit extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
    protected $table = 'kits';
    protected $fillable = [
        'nom',
        'description',
        'categorie_id',
        'is_active',
        'created_by',
        'updated_by',
        'ref',
    ];
    protected $casts = [
        'is_active' => 'boolean',
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
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updated_by()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    public function items(): BelongsToMany
    {
        return $this->belongsToMany(MedicalProduit::class, 'article_kits')
                    ->withPivot('quantite', 'ref')
                    ->withTimestamps();
    }

    // Relation avec la catégorie
    public function category(): BelongsTo
    {
        return $this->belongsTo(Categorie::class, 'categorie_id');
    }

    

    public function articles()
    {
        return $this->hasMany(ArticleKit::class);
    }

    
        
}
