<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kit extends Model
{
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
        
}
